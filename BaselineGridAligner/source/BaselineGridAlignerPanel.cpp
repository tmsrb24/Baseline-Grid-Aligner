#include "includes/BaselineGridAlignerPanel.h"
#include "IPanelCreator.h"
#include "IWidgetUtils.h"
#include "IControlView.h"
#include "IDropDownListController.h"
#include "IColorSelectorData.h"
#include "ITextControlData.h"
#include "ITriStateControlData.h"
#include "IActionStateList.h"
#include "IActionComponent.h"
#include "IActiveContext.h"
#include "IApplication.h"
#include "ISession.h"
#include "ISelectionManager.h"
#include "ISelectionUtils.h"
#include "ITextTarget.h"
#include "ITextModel.h"
#include "ILayoutUIUtils.h"
#include "IWidgetParent.h"
#include "IControlViewUtils.h"
#include "IStyleUtils.h"
#include "IStyleInfo.h"
#include "IDocument.h"
#include "IHierarchy.h"
#include "ICommand.h"
#include "CmdUtils.h"
#include "Utils.h"
#include "LocaleSetting.h"
#include "PMLocaleId.h"
#include "PMString.h"
#include "PMRect.h"
#include "K2Vector.h"
#include "IK2ServiceRegistry.h"
#include "IK2ServiceProvider.h"
#include "IUIService.h"
#include "IUIStyler.h"
#include "IUIColors.h"
#include "IUIFonts.h"
#include "IUIGeometry.h"
#include "IUILayout.h"
#include "IUITheme.h"
#include "IUIThemeManager.h"
#include "IUIThemeUtils.h"
#include "IUIDrawingUtils.h"
#include "IUIDrawingStyle.h"
#include "IUIDrawingStyleUtils.h"
#include "IUIDrawingStyleManager.h"
#include "IUIDrawingStyleProvider.h"
#include "IUIDrawingStyleFactory.h"
#include "IUIDrawingStyleAttributes.h"
#include "IUIDrawingStyleAttributeValues.h"
#include "IUIDrawingStyleAttributeValuesFactory.h"
#include "IUIDrawingStyleAttributeValuesProvider.h"
#include "IUIDrawingStyleAttributeValuesManager.h"
#include "IUIDrawingStyleAttributeValuesUtils.h"
#include "IUIDrawingStyleAttributeValuesFactory.h"
#include "IUIDrawingStyleAttributeValuesProvider.h"
#include "IUIDrawingStyleAttributeValuesManager.h"
#include "IUIDrawingStyleAttributeValuesUtils.h"
#include <memory>
#include <string>
#include <vector>

// Control IDs
#define kAlignmentTypeDropDownID       1
#define kHighlightColorSelectorID      2
#define kWordSpacingEditID             3
#define kAutoApplyCheckboxID           4
#define kShowWarningsCheckboxID        5
#define kPreviewEnabledCheckboxID      6
#define kApplyButtonID                 7
#define kResetButtonID                 8

// Panel dimensions
#define kPanelMargin                   10
#define kControlSpacing                8
#define kLabelWidth                    100
#define kControlHeight                 24
#define kButtonHeight                  30
#define kButtonWidth                   80

// BaselineGridAlignerPanel implementation
BaselineGridAlignerPanel::BaselineGridAlignerPanel(IPMUnknown* boss)
    : CPMUnknown<IPanel, IObserver>(boss),
      fPanelControlData(nil),
      fPanelWidgetView(nil),
      fWidgetParent(nil),
      fAlignmentTypeDropDown(nil),
      fHighlightColorSelector(nil),
      fWordSpacingEdit(nil),
      fAutoApplyCheckbox(nil),
      fShowWarningsCheckbox(nil),
      fPreviewEnabledCheckbox(nil),
      fIsActive(false),
      fIsVisible(false),
      fHasSelection(false),
      fHasDocument(false)
{
    // Create settings
    InterfacePtr<BaselineGridAlignerSettings> settings(
        ::CreateObject2<BaselineGridAlignerSettings>(kBaselineGridAlignerSettingsImpl));
    fSettings.reset(settings.forget());
    
    // Register as observer for selection changes
    InterfacePtr<ISubject> selectionSubject(GetExecutionContextSession()->QuerySelectionManager(), IID_ISELECTION);
    if (selectionSubject) {
        selectionSubject->AddObserver(this, IID_ISELECTION);
    }
    
    // Register as observer for document changes
    InterfacePtr<ISubject> docSubject(GetExecutionContextSession(), IID_IAPPLICATION);
    if (docSubject) {
        docSubject->AddObserver(this, IID_IAPPLICATION);
    }
}

BaselineGridAlignerPanel::~BaselineGridAlignerPanel()
{
    // Unregister observers
    InterfacePtr<ISubject> selectionSubject(GetExecutionContextSession()->QuerySelectionManager(), IID_ISELECTION);
    if (selectionSubject) {
        selectionSubject->RemoveObserver(this, IID_ISELECTION);
    }
    
    InterfacePtr<ISubject> docSubject(GetExecutionContextSession(), IID_IAPPLICATION);
    if (docSubject) {
        docSubject->RemoveObserver(this, IID_IAPPLICATION);
    }
}

void BaselineGridAlignerPanel::RegisterPanelWidget(IPanelControlData* panelControlData)
{
    fPanelControlData = panelControlData;
    
    // Get widget view
    InterfacePtr<IPMUnknown> widget(panelControlData->QueryPanelWidget());
    fPanelWidgetView = static_cast<IControlView*>(widget->QueryInterface(IID_ICONTROLVIEW));
    
    // Get widget parent
    fWidgetParent = static_cast<IWidgetParent*>(widget->QueryInterface(IID_IWIDGETPARENT));
    
    // Initialize controls
    InitializeControls();
    
    // Update controls from settings
    UpdateControlsFromSettings();
    
    // Enable/disable controls based on current state
    EnableDisableControls();
}

void BaselineGridAlignerPanel::UnRegisterPanelWidget(IPanelControlData* panelControlData)
{
    fPanelControlData = nil;
    fPanelWidgetView = nil;
    fWidgetParent = nil;
    fAlignmentTypeDropDown = nil;
    fHighlightColorSelector = nil;
    fWordSpacingEdit = nil;
    fAutoApplyCheckbox = nil;
    fShowWarningsCheckbox = nil;
    fPreviewEnabledCheckbox = nil;
}

void BaselineGridAlignerPanel::Update(const ClassID& theChange, ISubject* theSubject, 
                                     const PMIID& protocol, void* changedBy)
{
    if (protocol == IID_ISELECTION) {
        HandleSelectionUpdate();
    }
    else if (protocol == IID_IAPPLICATION) {
        if (theChange == kApplicationActiveDocumentChangedMessage) {
            HandleDocumentChange();
        }
    }
}

void BaselineGridAlignerPanel::HandleSelectionUpdate()
{
    // Check if there's a text selection
    InterfacePtr<ITextTarget> textTarget(Utils<ISelectionUtils>()->QueryActiveTextTarget());
    fHasSelection = (textTarget != nil);
    
    // Enable/disable controls based on selection
    EnableDisableControls();
    
    // Update preview if enabled
    if (fSettings && fSettings->GetPreviewEnabled() && fHasSelection) {
        UpdatePreview();
    }
}

void BaselineGridAlignerPanel::HandleDocumentChange()
{
    // Check if there's an active document
    InterfacePtr<IDocument> doc(GetExecutionContextDocument());
    fHasDocument = (doc != nil);
    
    // Enable/disable controls based on document
    EnableDisableControls();
}

void BaselineGridAlignerPanel::HandleActivate()
{
    fIsActive = true;
    EnableDisableControls();
}

void BaselineGridAlignerPanel::HandleDeactivate()
{
    fIsActive = false;
    EnableDisableControls();
}

void BaselineGridAlignerPanel::HandlePanelShow()
{
    fIsVisible = true;
    
    // Update preview if enabled
    if (fSettings && fSettings->GetPreviewEnabled() && fHasSelection) {
        UpdatePreview();
    }
}

void BaselineGridAlignerPanel::HandlePanelHide()
{
    fIsVisible = false;
    
    // Clear preview
    if (fSettings && fSettings->GetPreviewEnabled()) {
        // Code to clear preview would go here
    }
}

void BaselineGridAlignerPanel::AutoAttach()
{
    // Nothing to do
}

void BaselineGridAlignerPanel::AutoDetach()
{
    // Nothing to do
}

void BaselineGridAlignerPanel::GetObserverInfo(int32* numProtos, const PMIID** protoList)
{
    static const PMIID kProtoList[] = {
        IID_ISELECTION,
        IID_IAPPLICATION
    };
    
    *numProtos = 2;
    *protoList = kProtoList;
}

void BaselineGridAlignerPanel::InitializeControls()
{
    if (!fPanelWidgetView || !fWidgetParent) return;
    
    // Get DPI scale
    PMReal dpiScale = DPIScaler::GetScale();
    
    // Calculate dimensions
    PMReal margin = DPIScaler::Scale(kPanelMargin);
    PMReal spacing = DPIScaler::Scale(kControlSpacing);
    PMReal labelWidth = DPIScaler::Scale(kLabelWidth);
    PMReal controlHeight = DPIScaler::Scale(kControlHeight);
    PMReal buttonHeight = DPIScaler::Scale(kButtonHeight);
    PMReal buttonWidth = DPIScaler::Scale(kButtonWidth);
    
    // Get panel bounds
    PMRect panelBounds;
    fPanelWidgetView->GetBounds(&panelBounds);
    
    // Calculate control width
    PMReal controlWidth = panelBounds.Width() - margin * 2 - labelWidth - spacing;
    
    // Current Y position
    PMReal currentY = margin;
    
    // Create alignment type dropdown
    PMRect dropdownRect(margin + labelWidth + spacing, currentY, 
                       margin + labelWidth + spacing + controlWidth, currentY + controlHeight);
    
    InterfacePtr<IControlView> dropdownView(Utils<IWidgetUtils>()->CreateControl(fPanelWidgetView, 
                                                                               kAlignmentTypeDropDownID, 
                                                                               kDropDownWidgetBoss, 
                                                                               dropdownRect));
    
    // Add label
    PMRect labelRect(margin, currentY, margin + labelWidth, currentY + controlHeight);
    InterfacePtr<IControlView> labelView(Utils<IWidgetUtils>()->CreateStaticTextControl(fPanelWidgetView, 
                                                                                     0, 
                                                                                     "Typ zarovnání:", 
                                                                                     labelRect));
    
    // Get dropdown controller
    fAlignmentTypeDropDown = static_cast<IDropDownListController*>(dropdownView->QueryInterface(IID_IDROPDOWNLISTCONTROLLER));
    
    // Add items to dropdown
    if (fAlignmentTypeDropDown) {
        fAlignmentTypeDropDown->AddItem("Tracking", kAlignmentTypeTracking);
        fAlignmentTypeDropDown->AddItem("Baseline", kAlignmentTypeBaseline);
        fAlignmentTypeDropDown->AddItem("Mezislovní mezery", kAlignmentTypeWordSpacing);
        fAlignmentTypeDropDown->AddItem("Kombinované", kAlignmentTypeCombined);
    }
    
    // Move to next control
    currentY += controlHeight + spacing;
    
    // Create highlight color selector
    PMRect colorRect(margin + labelWidth + spacing, currentY, 
                    margin + labelWidth + spacing + controlWidth, currentY + controlHeight);
    
    InterfacePtr<IControlView> colorView(Utils<IWidgetUtils>()->CreateControl(fPanelWidgetView, 
                                                                           kHighlightColorSelectorID, 
                                                                           kColorSelectorWidgetBoss, 
                                                                           colorRect));
    
    // Add label
    labelRect = PMRect(margin, currentY, margin + labelWidth, currentY + controlHeight);
    labelView = Utils<IWidgetUtils>()->CreateStaticTextControl(fPanelWidgetView, 
                                                            0, 
                                                            "Barva zvýraznění:", 
                                                            labelRect);
    
    // Get color selector
    fHighlightColorSelector = static_cast<IColorSelectorData*>(colorView->QueryInterface(IID_ICOLORSELECTORDATA));
    
    // Move to next control
    currentY += controlHeight + spacing;
    
    // Create word spacing edit
    PMRect editRect(margin + labelWidth + spacing, currentY, 
                   margin + labelWidth + spacing + controlWidth, currentY + controlHeight);
    
    InterfacePtr<IControlView> editView(Utils<IWidgetUtils>()->CreateControl(fPanelWidgetView, 
                                                                          kWordSpacingEditID, 
                                                                          kEditBoxWidgetBoss, 
                                                                          editRect));
    
    // Add label
    labelRect = PMRect(margin, currentY, margin + labelWidth, currentY + controlHeight);
    labelView = Utils<IWidgetUtils>()->CreateStaticTextControl(fPanelWidgetView, 
                                                            0, 
                                                            "Faktor mezislovních mezer:", 
                                                            labelRect);
    
    // Get edit control
    fWordSpacingEdit = static_cast<ITextControlData*>(editView->QueryInterface(IID_ITEXTCONTROLDATA));
    
    // Move to next control
    currentY += controlHeight + spacing;
    
    // Create auto apply checkbox
    PMRect checkboxRect(margin, currentY, panelBounds.Width() - margin, currentY + controlHeight);
    
    InterfacePtr<IControlView> checkboxView(Utils<IWidgetUtils>()->CreateControl(fPanelWidgetView, 
                                                                               kAutoApplyCheckboxID, 
                                                                               kCheckBoxWidgetBoss, 
                                                                               checkboxRect));
    
    // Set checkbox text
    InterfacePtr<ITextControlData> checkboxText(checkboxView, IID_ITEXTCONTROLDATA);
    if (checkboxText) {
        checkboxText->SetText("Automaticky aplikovat změny");
    }
    
    // Get checkbox control
    fAutoApplyCheckbox = static_cast<ITriStateControlData*>(checkboxView->QueryInterface(IID_ITRISTATECONTROLDATA));
    
    // Move to next control
    currentY += controlHeight + spacing;
    
    // Create show warnings checkbox
    checkboxRect = PMRect(margin, currentY, panelBounds.Width() - margin, currentY + controlHeight);
    
    checkboxView = Utils<IWidgetUtils>()->CreateControl(fPanelWidgetView, 
                                                     kShowWarningsCheckboxID, 
                                                     kCheckBoxWidgetBoss, 
                                                     checkboxRect);
    
    // Set checkbox text
    checkboxText = checkboxView->QueryInterface(IID_ITEXTCONTROLDATA);
    if (checkboxText) {
        checkboxText->SetText("Zobrazovat varování");
    }
    
    // Get checkbox control
    fShowWarningsCheckbox = static_cast<ITriStateControlData*>(checkboxView->QueryInterface(IID_ITRISTATECONTROLDATA));
    
    // Move to next control
    currentY += controlHeight + spacing;
    
    // Create preview enabled checkbox
    checkboxRect = PMRect(margin, currentY, panelBounds.Width() - margin, currentY + controlHeight);
    
    checkboxView = Utils<IWidgetUtils>()->CreateControl(fPanelWidgetView, 
                                                     kPreviewEnabledCheckboxID, 
                                                     kCheckBoxWidgetBoss, 
                                                     checkboxRect);
    
    // Set checkbox text
    checkboxText = checkboxView->QueryInterface(IID_ITEXTCONTROLDATA);
    if (checkboxText) {
        checkboxText->SetText("Povolit náhled změn");
    }
    
    // Get checkbox control
    fPreviewEnabledCheckbox = static_cast<ITriStateControlData*>(checkboxView->QueryInterface(IID_ITRISTATECONTROLDATA));
    
    // Move to next control
    currentY += controlHeight + spacing * 2;
    
    // Create apply button
    PMRect applyButtonRect(panelBounds.Width() - margin - buttonWidth, currentY, 
                          panelBounds.Width() - margin, currentY + buttonHeight);
    
    InterfacePtr<IControlView> applyButtonView(Utils<IWidgetUtils>()->CreateControl(fPanelWidgetView, 
                                                                                 kApplyButtonID, 
                                                                                 kButtonWidgetBoss, 
                                                                                 applyButtonRect));
    
    // Set button text
    InterfacePtr<ITextControlData> applyButtonText(applyButtonView, IID_ITEXTCONTROLDATA);
    if (applyButtonText) {
        applyButtonText->SetText("Aplikovat");
    }
    
    // Create reset button
    PMRect resetButtonRect(panelBounds.Width() - margin - buttonWidth * 2 - spacing, currentY, 
                          panelBounds.Width() - margin - buttonWidth - spacing, currentY + buttonHeight);
    
    InterfacePtr<IControlView> resetButtonView(Utils<IWidgetUtils>()->CreateControl(fPanelWidgetView, 
                                                                                 kResetButtonID, 
                                                                                 kButtonWidgetBoss, 
                                                                                 resetButtonRect));
    
    // Set button text
    InterfacePtr<ITextControlData> resetButtonText(resetButtonView, IID_ITEXTCONTROLDATA);
    if (resetButtonText) {
        resetButtonText->SetText("Reset");
    }
    
    // Register for control events
    if (fWidgetParent) {
        fWidgetParent->RegisterForControlNotifications(kAlignmentTypeDropDownID, this);
        fWidgetParent->RegisterForControlNotifications(kHighlightColorSelectorID, this);
        fWidgetParent->RegisterForControlNotifications(kWordSpacingEditID, this);
        fWidgetParent->RegisterForControlNotifications(kAutoApplyCheckboxID, this);
        fWidgetParent->RegisterForControlNotifications(kShowWarningsCheckboxID, this);
        fWidgetParent->RegisterForControlNotifications(kPreviewEnabledCheckboxID, this);
        fWidgetParent->RegisterForControlNotifications(kApplyButtonID, this);
        fWidgetParent->RegisterForControlNotifications(kResetButtonID, this);
    }
}

void BaselineGridAlignerPanel::UpdateControlsFromSettings()
{
    if (!fSettings) return;
    
    // Update alignment type dropdown
    if (fAlignmentTypeDropDown) {
        fAlignmentTypeDropDown->SetSelectedItem(fSettings->GetAlignmentType());
    }
    
    // Update highlight color selector
    if (fHighlightColorSelector) {
        fHighlightColorSelector->SetColor(fSettings->GetHighlightColor());
    }
    
    // Update word spacing edit
    if (fWordSpacingEdit) {
        PMString wordSpacingStr;
        wordSpacingStr.AppendNumber(fSettings->GetWordSpacingFactor());
        fWordSpacingEdit->SetText(wordSpacingStr);
    }
    
    // Update checkboxes
    if (fAutoApplyCheckbox) {
        fAutoApplyCheckbox->SetState(fSettings->GetAutoApply() ? ITriStateControlData::kSelected : ITriStateControlData::kUnselected);
    }
    
    if (fShowWarningsCheckbox) {
        fShowWarningsCheckbox->SetState(fSettings->GetShowWarnings() ? ITriStateControlData::kSelected : ITriStateControlData::kUnselected);
    }
    
    if (fPreviewEnabledCheckbox) {
        fPreviewEnabledCheckbox->SetState(fSettings->GetPreviewEnabled() ? ITriStateControlData::kSelected : ITriStateControlData::kUnselected);
    }
}

void BaselineGridAlignerPanel::UpdateSettingsFromControls()
{
    if (!fSettings) return;
    
    // Update alignment type
    if (fAlignmentTypeDropDown) {
        fSettings->SetAlignmentType(static_cast<BaselineGridAlignmentType>(fAlignmentTypeDropDown->GetSelectedItem()));
    }
    
    // Update highlight color
    if (fHighlightColorSelector) {
        fSettings->SetHighlightColor(fHighlightColorSelector->GetColor());
    }
    
    // Update word spacing factor
    if (fWordSpacingEdit) {
        PMString wordSpacingStr;
        fWordSpacingEdit->GetText(&wordSpacingStr);
        
        PMReal factor = 1.0;
        wordSpacingStr.GetAsReal(&factor);
        fSettings->SetWordSpacingFactor(factor);
    }
    
    // Update checkboxes
    if (fAutoApplyCheckbox) {
        fSettings->SetAutoApply(fAutoApplyCheckbox->GetState() == ITriStateControlData::kSelected);
    }
    
    if (fShowWarningsCheckbox) {
        fSettings->SetShowWarnings(fShowWarningsCheckbox->GetState() == ITriStateControlData::kSelected);
    }
    
    if (fPreviewEnabledCheckbox) {
        fSettings->SetPreviewEnabled(fPreviewEnabledCheckbox->GetState() == ITriStateControlData::kSelected);
    }
    
    // Save settings
    fSettings->SaveSettings();
}

void BaselineGridAlignerPanel::ApplyAlignment()
{
    // Get BaselineGridAligner instance
    InterfacePtr<BaselineGridAligner> aligner(
        ::CreateObject2<BaselineGridAligner>(kBaselineGridAlignerImpl));
    
    if (aligner) {
        // Apply alignment
        aligner->AlignText();
    }
}

void BaselineGridAlignerPanel::UpdatePreview()
{
    // Get BaselineGridAligner instance
    InterfacePtr<BaselineGridAligner> aligner(
        ::CreateObject2<BaselineGridAligner>(kBaselineGridAlignerImpl));
    
    if (aligner) {
        // Clear previous preview
        aligner->ClearPreview();
        
        // Generate new preview
        aligner->GeneratePreview();
    }
}

void BaselineGridAlignerPanel::EnableDisableControls()
{
    bool enableControls = fIsActive && fIsVisible && fHasDocument;
    bool enableApply = enableControls && fHasSelection;
    
    // Enable/disable controls
    if (fPanelWidgetView) {
        // Enable/disable all controls
        for (int32 i = kAlignmentTypeDropDownID; i <= kPreviewEnabledCheckboxID; i++) {
            InterfacePtr<IControlView> control(fPanelWidgetView->FindWidget(i));
            if (control) {
                control->Enable(enableControls);
            }
        }
        
        // Enable/disable apply button
        InterfacePtr<IControlView> applyButton(fPanelWidgetView->FindWidget(kApplyButtonID));
        if (applyButton) {
            applyButton->Enable(enableApply);
        }
        
        // Reset button is always enabled if panel is active
        InterfacePtr<IControlView> resetButton(fPanelWidgetView->FindWidget(kResetButtonID));
        if (resetButton) {
            resetButton->Enable(enableControls);
        }
    }
}

void BaselineGridAlignerPanel::HandleAlignmentTypeChange()
{
    UpdateSettingsFromControls();
    
    // Update preview if enabled
    if (fSettings && fSettings->GetPreviewEnabled() && fHasSelection) {
        UpdatePreview();
    }
}

void BaselineGridAlignerPanel::HandleHighlightColorChange()
{
    UpdateSettingsFromControls();
    
    // Update preview if enabled
    if (fSettings && fSettings->GetPreviewEnabled() && fHasSelection) {
        UpdatePreview();
    }
}

void BaselineGridAlignerPanel::HandleWordSpacingChange()
{
    UpdateSettingsFromControls();
    
    // Update preview if enabled
    if (fSettings && fSettings->GetPreviewEnabled() && fHasSelection) {
        UpdatePreview();
    }
}

void BaselineGridAlignerPanel::HandleAutoApplyChange()
{
    UpdateSettingsFromControls();
}

void BaselineGridAlignerPanel::HandleShowWarningsChange()
{
    UpdateSettingsFromControls();
}

void BaselineGridAlignerPanel::HandlePreviewEnabledChange()
{
    UpdateSettingsFromControls();
    
    // Update preview if enabled
    if (fSettings && fSettings->GetPreviewEnabled() && fHasSelection) {
        UpdatePreview();
    }
    else if (fSettings && !fSettings->GetPreviewEnabled()) {
        // Clear preview
        InterfacePtr<BaselineGridAligner> aligner(
            ::CreateObject2<BaselineGridAligner>(kBaselineGridAlignerImpl));
        
        if (aligner) {
            aligner->ClearPreview();
        }
    }
}

void BaselineGridAlignerPanel::HandleApplyButtonClick()
{
    // Apply alignment
    ApplyAlignment();
}

void BaselineGridAlignerPanel::HandleResetButtonClick()
{
    // Reset settings to defaults
    if (fSettings) {
        fSettings->ResetToDefaults();
        UpdateControlsFromSettings();
    }
    
    // Update preview if enabled
    if (fSettings && fSettings->GetPreviewEnabled() && fHasSelection) {
        UpdatePreview();
    }
}

// BaselineGridAlignerPanelWidget implementation
BaselineGridAlignerPanelWidget::BaselineGridAlignerPanelWidget(IPMUnknown* boss)
    : CPMUnknown<IPanelControlData>(boss),
      fPanel(nil),
      fPanelWidget(nil),
      fIsVisible(false),
      fIsEnabled(true)
{
}

BaselineGridAlignerPanelWidget::~BaselineGridAlignerPanelWidget()
{
    // Clean up
    if (fPanelWidget) {
        DestroyPanelWidget();
    }
}

IPMUnknown* BaselineGridAlignerPanelWidget::QueryPanel() const
{
    return fPanel;
}

void BaselineGridAlignerPanelWidget::SetPanelController(IPMUnknown* panel)
{
    fPanel = panel;
}

IPMUnknown* BaselineGridAlignerPanelWidget::QueryPanelController() const
{
    return fPanel;
}

void BaselineGridAlignerPanelWidget::QueryMaxPanelDimensions(PMRect* maxDimensions) const
{
    if (maxDimensions) {
        // No maximum dimensions
        maxDimensions->Set(0, 0, 10000, 10000);
    }
}

void BaselineGridAlignerPanelWidget::QueryMinPanelDimensions(PMRect* minDimensions) const
{
    if (minDimensions) {
        // Set minimum dimensions
        PMReal minWidth = DPIScaler::Scale(kBaselineGridAlignerPanelMinWidth);
        PMReal minHeight = DPIScaler::Scale(kBaselineGridAlignerPanelMinHeight);
        minDimensions->Set(0, 0, minWidth, minHeight);
    }
}

void BaselineGridAlignerPanelWidget::QueryDefaultPanelDimensions(PMRect* defaultDimensions) const
{
    if (defaultDimensions) {
        // Set default dimensions
        PMReal defaultWidth = DPIScaler::Scale(kBaselineGridAlignerPanelDefaultWidth);
        PMReal defaultHeight = DPIScaler::Scale(kBaselineGridAlignerPanelDefaultHeight);
        defaultDimensions->Set(0, 0, defaultWidth, defaultHeight);
    }
}

void BaselineGridAlignerPanelWidget::PanelResized(const PMRect& panelRect)
{
    // Handle panel resize
    if (fPanelWidget) {
        InterfacePtr<IControlView> widgetView(fPanelWidget, IID_ICONTROLVIEW);
        if (widgetView) {
            widgetView->SetBounds(panelRect);
            
            // Re-layout widgets
            LayoutWidgets(widgetView, panelRect);
        }
    }
}

IPMUnknown* BaselineGridAlignerPanelWidget::CreatePanelWidget(IPMUnknown* parent)
{
    if (fPanelWidget) {
        DestroyPanelWidget();
    }
    
    // Create panel widget
    InterfacePtr<IPMUnknown> widget(Utils<IWidgetUtils>()->CreateCustomWidget(parent, kViewRsrcType));
    if (!widget) return nil;
    
    fPanelWidget = widget;
    
    // Get control view
    InterfacePtr<IControlView> widgetView(widget, IID_ICONTROLVIEW);
    if (!widgetView) return nil;
    
    // Set bounds
    PMRect defaultBounds;
    QueryDefaultPanelDimensions(&defaultBounds);
    widgetView->SetBounds(defaultBounds);
    
    // Create widgets
    CreateWidgets(widgetView);
    
    // Layout widgets
    LayoutWidgets(widgetView, defaultBounds);
    
    // Register panel with controller
    InterfacePtr<IPanel> panel(fPanel, IID_IPANEL);
    if (panel) {
        panel->RegisterPanelWidget(this);
    }
    
    return fPanelWidget;
}

void BaselineGridAlignerPanelWidget::DestroyPanelWidget()
{
    // Unregister panel
    InterfacePtr<IPanel> panel(fPanel, IID_IPANEL);
    if (panel) {
        panel->UnRegisterPanelWidget(this);
    }
    
    fPanelWidget = nil;
}

IPMUnknown* BaselineGridAlignerPanelWidget::QueryPanelWidget() const
{
    return fPanelWidget;
}

void BaselineGridAlignerPanelWidget::ShowPanelWidget()
{
    fIsVisible = true;
    
    // Show panel
    if (fPanelWidget) {
        InterfacePtr<IControlView> widgetView(fPanelWidget, IID_ICONTROLVIEW);
        if (widgetView) {
            widgetView->Show();
        }
    }
    
    // Notify panel
    InterfacePtr<IPanel> panel(fPanel, IID_IPANEL);
    if (panel) {
        panel->HandlePanelShow();
    }
}

void BaselineGridAlignerPanelWidget::HidePanelWidget()
{
    fIsVisible = false;
    
    // Hide panel
    if (fPanelWidget) {
        InterfacePtr<IControlView> widgetView(fPanelWidget, IID_ICONTROLVIEW);
        if (widgetView) {
            widgetView->Hide();
        }
    }
    
    // Notify panel
    InterfacePtr<IPanel> panel(fPanel, IID_IPANEL);
    if (panel) {
        panel->HandlePanelHide();
    }
}

void BaselineGridAlignerPanelWidget::EnablePanelWidget(bool enable)
{
    fIsEnabled = enable;
    
    // Enable/disable panel
    if (fPanelWidget) {
        InterfacePtr<IControlView> widgetView(fPanelWidget, IID_ICONTROLVIEW);
        if (widgetView) {
            widgetView->Enable(enable);
        }
    }
}

bool BaselineGridAlignerPanelWidget::IsPanelWidgetEnabled() const
{
    return fIsEnabled;
}

bool BaselineGridAlignerPanelWidget::IsPanelWidgetVisible() const
{
    return fIsVisible;
}

void BaselineGridAlignerPanelWidget::CreateWidgets(IControlView* widgetView)
{
    // Nothing to do here, widgets are created in BaselineGridAlignerPanel::InitializeControls
}

void BaselineGridAlignerPanelWidget::LayoutWidgets(IControlView* widgetView, const PMRect& bounds)
{
    // Nothing to do here, widgets are laid out in BaselineGridAlignerPanel::InitializeControls
}

// Register implementations
CREATE_PMINTERFACE(BaselineGridAlignerPanel, kBaselineGridAlignerPanelImpl)
CREATE_PMINTERFACE(BaselineGridAlignerPanelWidget, kBaselineGridAlignerPanelWidgetImpl)
