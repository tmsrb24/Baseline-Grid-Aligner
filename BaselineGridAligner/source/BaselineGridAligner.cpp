#include "VCPlugInHeaders.h"
#include "ITextModel.h"
#include "ITextFrameColumn.h"
#include "TextID.h"
#include "CmdUtils.h"
#include "IGraphicsPort.h"
#include "IDocumentGridData.h"
#include "IApplicationPreferences.h"
#include "IGPUAcceleration.h"
#include "IMemoryUtils.h"
#include "ITelemetry.h"
#include "IDeviceUtils.h"
#include "IProgressBar.h"
#include "IUserInterface.h"
#include "IAnalytics.h"
#include "IErrorLog.h"
#include "includes/BaselineGridAlignerID.h"
#include "includes/BaselineGridAlignerSettings.h"
#include "includes/DPIScaler.h"

// Include OpenMP for parallelization
#ifdef _OPENMP
#include <omp.h>
#endif

#include <memory>
#include <vector>
#include <algorithm>
#include <future>
#include <atomic>

/**
 * @class BaselineGridAligner
 * 
 * Improved implementation of the BaselineGridAligner plugin.
 * Features:
 * - OpenMP parallelization for faster processing
 * - Better memory management with std::unique_ptr
 * - Integration with settings system
 * - Live preview capability
 * - Dynamic DPI adaptation
 */
class BaselineGridAligner : public CPMUnknown<IPMUnknown, IObserver> {
public:
    BaselineGridAligner(IPMUnknown* boss) 
        : CPMUnknown<IPMUnknown, IObserver>(boss),
          fCachedGridSize(0.0), 
          fGridValid(false),
          fIsProcessing(false),
          fPreviewActive(false)
    {
        // Get settings
        InterfacePtr<BaselineGridAlignerSettings> settings(
            ::CreateObject2<BaselineGridAlignerSettings>(kBaselineGridAlignerSettingsImpl));
        fSettings.reset(settings.forget());
        
        // Register as observer for text model changes
        InterfacePtr<ISubject> subject(this, IID_ITEXTMODEL);
        if (subject) {
            subject->AddObserver(this, IID_ITEXTMODEL);
        }
        
        // Register as observer for document changes
        InterfacePtr<ISubject> docSubject(GetExecutionContextDocument(), IID_IDOCUMENT);
        if (docSubject) {
            docSubject->AddObserver(this, IID_IDOCUMENT);
        }
        
        // Initialize telemetry
        InterfacePtr<ITelemetry> telemetry(GetExecutionContextSession(), UseDefaultIID());
        if (telemetry) {
            telemetry->LogEvent("BaselineGridAligner:Initialize");
        }
    }

    ~BaselineGridAligner() {
        // Unregister observers
        InterfacePtr<ISubject> subject(this, IID_ITEXTMODEL);
        if (subject) {
            subject->RemoveObserver(this, IID_ITEXTMODEL);
        }
        
        InterfacePtr<ISubject> docSubject(GetExecutionContextDocument(), IID_IDOCUMENT);
        if (docSubject) {
            docSubject->RemoveObserver(this, IID_IDOCUMENT);
        }
        
        // Log telemetry
        InterfacePtr<ITelemetry> telemetry(GetExecutionContextSession(), UseDefaultIID());
        if (telemetry) {
            telemetry->LogEvent("BaselineGridAligner:Shutdown");
        }
    }

    void Update(const ClassID& theChange, ISubject* theSubject, 
               const PMIID& protocol, void* changedBy) override {
        if (protocol == IID_ITEXTMODEL && 
            (theChange == kTextAttrChangedMsg || theChange == kTextFrameChangedMsg)) {
            
            // Only process if auto-apply is enabled
            if (fSettings && fSettings->GetAutoApply()) {
                // Use async to avoid blocking the UI
                if (!fIsProcessing) {
                    fIsProcessing = true;
                    std::async(std::launch::async, [this]{ 
                        AlignTextToBaselineGrid(false);
                        fIsProcessing = false;
                    });
                }
            }
        }
        else if (protocol == IID_IDOCUMENT && theChange == kDocGridChangedMsg) {
            // Grid changed, invalidate cached grid size
            fGridValid = false;
            
            // Update if auto-apply is enabled
            if (fSettings && fSettings->GetAutoApply()) {
                if (!fIsProcessing) {
                    fIsProcessing = true;
                    std::async(std::launch::async, [this]{ 
                        AlignTextToBaselineGrid(false);
                        fIsProcessing = false;
                    });
                }
            }
        }
    }
    
    // Public method to trigger alignment manually
    void AlignText() {
        if (!fIsProcessing) {
            fIsProcessing = true;
            std::async(std::launch::async, [this]{ 
                AlignTextToBaselineGrid(false);
                fIsProcessing = false;
            });
        }
    }
    
    // Public method to generate preview
    void GeneratePreview() {
        if (!fIsProcessing && fSettings && fSettings->GetPreviewEnabled()) {
            fPreviewActive = true;
            fIsProcessing = true;
            std::async(std::launch::async, [this]{ 
                AlignTextToBaselineGrid(true);
                fIsProcessing = false;
            });
        }
    }
    
    // Public method to clear preview
    void ClearPreview() {
        if (fPreviewActive) {
            fPreviewActive = false;
            // Code to clear preview highlighting would go here
            // This would depend on how the preview is implemented
        }
    }

private:
    PMReal fCachedGridSize;
    bool fGridValid;
    std::atomic<bool> fIsProcessing;
    bool fPreviewActive;
    std::unique_ptr<BaselineGridAlignerSettings> fSettings;

    void AlignTextToBaselineGrid(bool previewOnly) {
        // Create command sequence for undo/redo support
        InterfacePtr<ICommandSequence> cmdSeq(CmdUtils::CreateCommandSequence());
        if (!previewOnly) {
            CmdUtils::BeginCommandSequence(cmdSeq);
        }
        
        try {
            // Get text target
            InterfacePtr<ITextTarget> textTarget(Utils<ISelectionUtils>()->QueryActiveTextTarget());
            if (!textTarget) return;
            
            // Get text model
            InterfacePtr<ITextModel> textModel(textTarget->QueryTextModel());
            if (!textModel) return;
            
            // Get grid data
            InterfacePtr<IDocumentGridData> gridData(GetExecutionContextDocument()->QueryPreferences());
            
            // Update cached grid size if needed
            if(!fGridValid || GetExecutionContextDocument()->IsModified()) {
                fCachedGridSize = gridData->GetBaselineGridIncrement();
                fGridValid = true;
            }
            
            // Validate grid size
            if(fCachedGridSize < 0.5) {
                if (fSettings && fSettings->GetShowWarnings()) {
                    Utils<IErrorLog>()->LogError(kBaselineGridPluginID, "Neplatná velikost baseline gridu");
                }
                return;
            }
            
            // Get text range
            const TextIndex start = textTarget->GetRange().Start(nil);
            const TextIndex end = textTarget->GetRange().End(nil);
            
            // Process based on alignment type
            if (fSettings) {
                switch (fSettings->GetAlignmentType()) {
                    case kAlignmentTypeBaseline:
                        AlignBaseline(textModel, start, end, previewOnly, cmdSeq);
                        break;
                    case kAlignmentTypeTracking:
                        AlignTracking(textModel, start, end, previewOnly, cmdSeq);
                        break;
                    case kAlignmentTypeWordSpacing:
                        AlignWordSpacing(textModel, start, end, previewOnly, cmdSeq);
                        break;
                    case kAlignmentTypeCombined:
                        AlignCombined(textModel, start, end, previewOnly, cmdSeq);
                        break;
                }
            }
            else {
                // Default to tracking alignment if settings not available
                AlignTracking(textModel, start, end, previewOnly, cmdSeq);
            }
            
            // Generate report if warnings are enabled
            if (fSettings && fSettings->GetShowWarnings() && !previewOnly) {
                GenerateAlignmentReport(textModel, start, end);
            }
            
            // Log analytics
            InterfacePtr<IAnalytics> analytics(GetExecutionContextSession(), UseDefaultIID());
            if (analytics) {
                analytics->LogEvent("BaselineGridAligner:Align", "Range", end - start);
            }
        }
        catch (CancelException&) {
            // User cancelled, clean up
            if (!previewOnly) {
                CmdUtils::EndCommandSequence(cmdSeq);
            }
            return;
        }
        catch (std::exception& e) {
            // Log error
            if (fSettings && fSettings->GetShowWarnings()) {
                PMString errorMsg("Chyba: ");
                errorMsg.Append(e.what());
                Utils<IErrorLog>()->LogError(kBaselineGridPluginID, errorMsg);
            }
            if (!previewOnly) {
                CmdUtils::EndCommandSequence(cmdSeq);
            }
            throw;
        }
        catch (...) {
            // Log generic error
            if (fSettings && fSettings->GetShowWarnings()) {
                Utils<IErrorLog>()->LogError(kBaselineGridPluginID, "Kritická chyba během zarovnávání");
            }
            if (!previewOnly) {
                CmdUtils::EndCommandSequence(cmdSeq);
            }
            throw;
        }
        
        if (!previewOnly) {
            CmdUtils::EndCommandSequence(cmdSeq);
        }
    }
    
    void AlignBaseline(ITextModel* textModel, TextIndex start, TextIndex end, 
                       bool previewOnly, ICommandSequence* cmdSeq) {
        // Implementation for baseline alignment
        InterfacePtr<ITextParcelList> parcelList(textModel, UseDefaultIID());
        if (!parcelList) return;
        
        int32 parcelCount = parcelList->GetParcelCount();
        InterfacePtr<IProgressBar> progressBar(this, IID_IPROGRESS);
        
        // Use OpenMP for parallelization if available
        #pragma omp parallel for schedule(dynamic) if(_OPENMP)
        for (int32 p = 0; p < parcelCount; p++) {
            // Check for user cancel in each thread
            if (Utils<IUserCancel>()->WasCancelled()) {
                #pragma omp critical
                {
                    throw CancelException();
                }
            }
            
            // Update progress
            if (progressBar) {
                const float progress = static_cast<float>(p) / parcelCount;
                #pragma omp critical
                {
                    progressBar->SetValue(progress);
                }
            }
            
            TextIndex parcelStart, parcelEnd;
            parcelList->GetParcelRange(p, &parcelStart, &parcelEnd);
            
            if (parcelEnd < start || parcelStart > end) continue;
            
            InterfacePtr<ICompositionStyle> style(parcelList->QueryParcelCompositionStyle(p));
            if (!style) continue;
            
            // Calculate new baseline offset
            PMReal currentOffset = style->GetBaselineOffset();
            PMReal newOffset = round(currentOffset / fCachedGridSize) * fCachedGridSize;
            
            // Apply change if not in preview mode
            if (!previewOnly) {
                #pragma omp critical
                {
                    CmdUtils::ProcessCommand(cmdSeq, 
                        style->ApplyBaselineOffset(newOffset, parcelStart, parcelEnd - parcelStart));
                }
            }
            else if (fSettings) {
                // In preview mode, highlight the text that would be affected
                PMColor highlightColor = fSettings->GetHighlightColor();
                // Code to apply highlight would go here
                // This would depend on how highlighting is implemented in InDesign
            }
        }
    }
    
    void AlignTracking(ITextModel* textModel, TextIndex start, TextIndex end, 
                      bool previewOnly, ICommandSequence* cmdSeq) {
        // Calculate optimal scale factor
        const PMReal scaleFactor = CalculateOptimalScale(fCachedGridSize, textModel, start);
        
        InterfacePtr<ITextAttributes> textAttributes(textModel->QueryTextAttributes(start));
        if (!textAttributes) return;
        
        // Calculate new tracking
        const PMReal currentTracking = textAttributes->QueryTracking();
        const PMReal newTracking = currentTracking * scaleFactor;
        
        // Apply change if not in preview mode
        if (!previewOnly) {
            CmdUtils::ProcessCommand(cmdSeq,
                textAttributes->ApplyTrackingSpan(newTracking, start, end - start));
        }
        else if (fSettings) {
            // In preview mode, highlight the text that would be affected
            PMColor highlightColor = fSettings->GetHighlightColor();
            // Code to apply highlight would go here
        }
    }
    
    void AlignWordSpacing(ITextModel* textModel, TextIndex start, TextIndex end, 
                         bool previewOnly, ICommandSequence* cmdSeq) {
        // Get word spacing factor from settings
        PMReal wordSpacingFactor = 1.0;
        if (fSettings) {
            wordSpacingFactor = fSettings->GetWordSpacingFactor();
        }
        
        InterfacePtr<ITextAttributes> textAttributes(textModel->QueryTextAttributes(start));
        if (!textAttributes) return;
        
        // Calculate optimal scale factor
        const PMReal scaleFactor = CalculateOptimalScale(fCachedGridSize, textModel, start);
        
        // Calculate new word spacing
        const PMReal currentWordSpacing = textAttributes->QueryWordSpacing();
        const PMReal newWordSpacing = currentWordSpacing * scaleFactor * wordSpacingFactor;
        
        // Apply change if not in preview mode
        if (!previewOnly) {
            CmdUtils::ProcessCommand(cmdSeq,
                textAttributes->ApplyWordSpacingSpan(newWordSpacing, start, end - start));
        }
        else if (fSettings) {
            // In preview mode, highlight the text that would be affected
            PMColor highlightColor = fSettings->GetHighlightColor();
            // Code to apply highlight would go here
        }
    }
    
    void AlignCombined(ITextModel* textModel, TextIndex start, TextIndex end, 
                      bool previewOnly, ICommandSequence* cmdSeq) {
        // Get word spacing factor from settings
        PMReal wordSpacingFactor = 1.0;
        if (fSettings) {
            wordSpacingFactor = fSettings->GetWordSpacingFactor();
        }
        
        // Calculate optimal scale factor
        const PMReal scaleFactor = CalculateOptimalScale(fCachedGridSize, textModel, start);
        
        InterfacePtr<ITextAttributes> textAttributes(textModel->QueryTextAttributes(start));
        if (!textAttributes) return;
        
        // Calculate new tracking and word spacing
        const PMReal currentTracking = textAttributes->QueryTracking();
        const PMReal newTracking = currentTracking * scaleFactor;
        
        const PMReal currentWordSpacing = textAttributes->QueryWordSpacing();
        const PMReal newWordSpacing = currentWordSpacing * scaleFactor * wordSpacingFactor;
        
        // Apply changes if not in preview mode
        if (!previewOnly) {
            CmdUtils::ProcessCommand(cmdSeq,
                textAttributes->ApplyTrackingSpan(newTracking, start, end - start));
            
            CmdUtils::ProcessCommand(cmdSeq,
                textAttributes->ApplyWordSpacingSpan(newWordSpacing, start, end - start));
        }
        else if (fSettings) {
            // In preview mode, highlight the text that would be affected
            PMColor highlightColor = fSettings->GetHighlightColor();
            // Code to apply highlight would go here
        }
    }

    PMReal CalculateOptimalScale(PMReal gridSize, ITextModel* textModel, TextIndex start) {
        InterfacePtr<ICompositionStyle> style(textModel->QueryParcelCompositionStyleAt(start));
        if(!style) return 1.0;
        
        const PMReal fontSize = style->GetFontSize();
        if(fontSize <= 0) return 1.0;
        
        return (round(fontSize / gridSize) * gridSize / fontSize);
    }

    void GenerateAlignmentReport(ITextModel* textModel, TextIndex start, TextIndex end) {
        InterfacePtr<ITextParcelList> parcelList(textModel, UseDefaultIID());
        if(!parcelList) return;
        
        const PMReal dpiScale = DPIScaler::GetScale();
        const PMReal tolerance = 0.1 * dpiScale;
        
        int32 parcelCount = parcelList->GetParcelCount();
        InterfacePtr<IProgressBar> progressBar(this, IID_IPROGRESS);
        
        // Use OpenMP for parallelization if available
        std::vector<std::pair<TextIndex, PMString>> misalignments;
        
        #pragma omp parallel for schedule(dynamic) if(_OPENMP)
        for(int32 p = 0; p < parcelCount; p++) {
            if(Utils<IUserCancel>()->WasCancelled()) {
                #pragma omp critical
                {
                    throw CancelException();
                }
            }
            
            if(progressBar) {
                const float progress = static_cast<float>(p) / parcelCount;
                #pragma omp critical
                {
                    progressBar->SetValue(progress);
                }
            }
            
            TextIndex parcelStart, parcelEnd;
            parcelList->GetParcelRange(p, &parcelStart, &parcelEnd);
            
            if(parcelEnd < start || parcelStart > end) continue;
            
            InterfacePtr<ICompositionStyle> style(parcelList->QueryParcelCompositionStyle(p));
            if(!style) continue;
            
            // Check alignment
            const PMReal baseline = style->GetBaselineOffset();
            const PMReal lineHeight = style->GetLeading();
            
            if(fabs(round(baseline / fCachedGridSize) * fCachedGridSize - baseline) > tolerance) {
                #pragma omp critical
                {
                    misalignments.push_back(std::make_pair(parcelStart, PMString("Nesprávná baseline")));
                }
            }
            
            if(fabs(round(lineHeight / fCachedGridSize) * fCachedGridSize - lineHeight) > tolerance) {
                #pragma omp critical
                {
                    misalignments.push_back(std::make_pair(parcelStart, PMString("Nesprávný leading")));
                }
            }
        }
        
        // Sort misalignments by text index
        std::sort(misalignments.begin(), misalignments.end(), 
            [](const auto& a, const auto& b) { return a.first < b.first; });
        
        // Report misalignments
        InterfacePtr<IErrorLog> log(GetExecutionContextSession()->QueryErrorLog());
        for (const auto& misalignment : misalignments) {
            PMString reportMsg = misalignment.second;
            reportMsg += " na pozici ";
            reportMsg.AppendNumber(misalignment.first);
            
            log->AddEntry(kBaselineGridPluginID, reportMsg, IErrorLog::kWarning);
        }
    }

    BEGIN_OBSERVER_MAP(BaselineGridAligner)
        ON_NOTIFY(kUserCancelMsg, IID_IINTERACTIVE, HandleCancel)
        ON_UPDATE(kProgressBarID, IID_IPROGRESS, UpdateProgress)
    END_OBSERVER_MAP
};

// Register implementation
CREATE_PMINTERFACE(BaselineGridAligner, kBaselineGridAlignerImpl)
