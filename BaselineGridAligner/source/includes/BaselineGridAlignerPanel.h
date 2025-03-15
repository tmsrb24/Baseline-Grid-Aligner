#ifndef __BaselineGridAlignerPanel__
#define __BaselineGridAlignerPanel__

#include "IPMUnknown.h"
#include "IPanel.h"
#include "IPanelControlData.h"
#include "IControlView.h"
#include "IWidgetParent.h"
#include "ITriStateControlData.h"
#include "IDropDownListController.h"
#include "IColorSelectorData.h"
#include "ITextControlData.h"
#include "IActiveContext.h"
#include "ISubject.h"
#include "IObserver.h"
#include "ICommand.h"
#include "BaselineGridAlignerID.h"
#include "BaselineGridAlignerSettings.h"
#include "DPIScaler.h"
#include <memory>

/**
 * @class BaselineGridAlignerPanel
 * 
 * UI panel for the BaselineGridAligner plugin.
 * Provides a clean, intuitive interface for controlling the baseline grid alignment.
 */
class BaselineGridAlignerPanel : public CPMUnknown<IPanel, IObserver> {
public:
    BaselineGridAlignerPanel(IPMUnknown* boss);
    virtual ~BaselineGridAlignerPanel();

    // IPanel implementation
    virtual void RegisterPanelWidget(IPanelControlData* panelControlData) override;
    virtual void UnRegisterPanelWidget(IPanelControlData* panelControlData) override;
    virtual void Update(const ClassID& theChange, ISubject* theSubject, const PMIID& protocol, void* changedBy) override;
    virtual void HandleSelectionUpdate() override;
    virtual void HandleDocumentChange() override;
    virtual void HandleActivate() override;
    virtual void HandleDeactivate() override;
    virtual void HandlePanelShow() override;
    virtual void HandlePanelHide() override;
    
    // Observer methods
    virtual void AutoAttach() override;
    virtual void AutoDetach() override;
    virtual void GetObserverInfo(int32* numProtos, const PMIID** protoList) override;

private:
    // UI elements
    IPanelControlData* fPanelControlData;
    IControlView* fPanelWidgetView;
    IWidgetParent* fWidgetParent;
    
    // Control data
    IDropDownListController* fAlignmentTypeDropDown;
    IColorSelectorData* fHighlightColorSelector;
    ITextControlData* fWordSpacingEdit;
    ITriStateControlData* fAutoApplyCheckbox;
    ITriStateControlData* fShowWarningsCheckbox;
    ITriStateControlData* fPreviewEnabledCheckbox;
    
    // Settings
    std::unique_ptr<BaselineGridAlignerSettings> fSettings;
    
    // State
    bool fIsActive;
    bool fIsVisible;
    bool fHasSelection;
    bool fHasDocument;
    
    // Methods
    void InitializeControls();
    void UpdateControlsFromSettings();
    void UpdateSettingsFromControls();
    void ApplyAlignment();
    void UpdatePreview();
    void EnableDisableControls();
    
    // Event handlers
    void HandleAlignmentTypeChange();
    void HandleHighlightColorChange();
    void HandleWordSpacingChange();
    void HandleAutoApplyChange();
    void HandleShowWarningsChange();
    void HandlePreviewEnabledChange();
    void HandleApplyButtonClick();
    void HandleResetButtonClick();
};

/**
 * @class BaselineGridAlignerPanelWidget
 * 
 * Widget for the BaselineGridAligner panel.
 * Handles the panel's UI layout and widget creation.
 */
class BaselineGridAlignerPanelWidget : public CPMUnknown<IPanelControlData> {
public:
    BaselineGridAlignerPanelWidget(IPMUnknown* boss);
    virtual ~BaselineGridAlignerPanelWidget();
    
    // IPanelControlData implementation
    virtual IPMUnknown* QueryPanel() const override;
    virtual void SetPanelController(IPMUnknown* panel) override;
    virtual IPMUnknown* QueryPanelController() const override;
    virtual void QueryMaxPanelDimensions(PMRect* maxDimensions) const override;
    virtual void QueryMinPanelDimensions(PMRect* minDimensions) const override;
    virtual void QueryDefaultPanelDimensions(PMRect* defaultDimensions) const override;
    virtual void PanelResized(const PMRect& panelRect) override;
    virtual IPMUnknown* CreatePanelWidget(IPMUnknown* parent) override;
    virtual void DestroyPanelWidget() override;
    virtual IPMUnknown* QueryPanelWidget() const override;
    virtual void ShowPanelWidget() override;
    virtual void HidePanelWidget() override;
    virtual void EnablePanelWidget(bool enable) override;
    virtual bool IsPanelWidgetEnabled() const override;
    virtual bool IsPanelWidgetVisible() const override;
    
private:
    IPMUnknown* fPanel;
    IPMUnknown* fPanelWidget;
    bool fIsVisible;
    bool fIsEnabled;
    
    // Helper methods
    void CreateWidgets(IControlView* widgetView);
    void LayoutWidgets(IControlView* widgetView, const PMRect& bounds);
};

#endif // __BaselineGridAlignerPanel__
