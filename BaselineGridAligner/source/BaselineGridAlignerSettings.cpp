#include "includes/BaselineGridAlignerSettings.h"

BaselineGridAlignerSettings::BaselineGridAlignerSettings(IPMUnknown* boss)
    : CPMUnknown<IPMUnknown>(boss),
      fAlignmentType(kAlignmentTypeTracking),
      fWordSpacingFactor(1.0),
      fAutoApply(true),
      fShowWarnings(true),
      fPreviewEnabled(true)
{
    // Set default highlight color (light blue)
    fHighlightColor = PMColor(0.5, 0.8, 1.0, 0.3);
    
    // Load saved settings
    LoadSettings();
}

BaselineGridAlignerSettings::~BaselineGridAlignerSettings()
{
    // Save settings when object is destroyed
    SaveSettings();
}

void BaselineGridAlignerSettings::LoadSettings()
{
    auto prefs = GetPreferences();
    if (!prefs) return;
    
    // Load color
    PMReal r = 0.5, g = 0.8, b = 1.0, a = 0.3;
    prefs->GetRealPref(kBaselineGridAlignerHighlightColorKey + PMString("_R"), &r);
    prefs->GetRealPref(kBaselineGridAlignerHighlightColorKey + PMString("_G"), &g);
    prefs->GetRealPref(kBaselineGridAlignerHighlightColorKey + PMString("_B"), &b);
    prefs->GetRealPref(kBaselineGridAlignerHighlightColorKey + PMString("_A"), &a);
    fHighlightColor = PMColor(r, g, b, a);
    
    // Load alignment type
    int32 alignType = static_cast<int32>(kAlignmentTypeTracking);
    prefs->GetInt32Pref(kBaselineGridAlignerAlignmentTypeKey, &alignType);
    fAlignmentType = static_cast<BaselineGridAlignmentType>(alignType);
    
    // Load word spacing factor
    PMReal factor = 1.0;
    prefs->GetRealPref(kBaselineGridAlignerWordSpacingKey, &factor);
    fWordSpacingFactor = factor;
    
    // Load boolean settings
    bool autoApply = true;
    prefs->GetBoolPref(kBaselineGridAlignerAutoApplyKey, &autoApply);
    fAutoApply = autoApply;
    
    bool showWarnings = true;
    prefs->GetBoolPref(kBaselineGridAlignerShowWarningsKey, &showWarnings);
    fShowWarnings = showWarnings;
    
    bool previewEnabled = true;
    prefs->GetBoolPref(kBaselineGridAlignerPreviewEnabledKey, &previewEnabled);
    fPreviewEnabled = previewEnabled;
}

void BaselineGridAlignerSettings::SaveSettings()
{
    auto prefs = GetPreferences();
    if (!prefs) return;
    
    // Save color
    prefs->SetRealPref(kBaselineGridAlignerHighlightColorKey + PMString("_R"), fHighlightColor.red);
    prefs->SetRealPref(kBaselineGridAlignerHighlightColorKey + PMString("_G"), fHighlightColor.green);
    prefs->SetRealPref(kBaselineGridAlignerHighlightColorKey + PMString("_B"), fHighlightColor.blue);
    prefs->SetRealPref(kBaselineGridAlignerHighlightColorKey + PMString("_A"), fHighlightColor.alpha);
    
    // Save alignment type
    prefs->SetInt32Pref(kBaselineGridAlignerAlignmentTypeKey, static_cast<int32>(fAlignmentType));
    
    // Save word spacing factor
    prefs->SetRealPref(kBaselineGridAlignerWordSpacingKey, fWordSpacingFactor);
    
    // Save boolean settings
    prefs->SetBoolPref(kBaselineGridAlignerAutoApplyKey, fAutoApply);
    prefs->SetBoolPref(kBaselineGridAlignerShowWarningsKey, fShowWarnings);
    prefs->SetBoolPref(kBaselineGridAlignerPreviewEnabledKey, fPreviewEnabled);
}

void BaselineGridAlignerSettings::SetHighlightColor(const PMColor& color)
{
    fHighlightColor = color;
}

void BaselineGridAlignerSettings::SetAlignmentType(BaselineGridAlignmentType type)
{
    fAlignmentType = type;
}

void BaselineGridAlignerSettings::SetWordSpacingFactor(PMReal factor)
{
    fWordSpacingFactor = factor;
}

void BaselineGridAlignerSettings::SetAutoApply(bool autoApply)
{
    fAutoApply = autoApply;
}

void BaselineGridAlignerSettings::SetShowWarnings(bool showWarnings)
{
    fShowWarnings = showWarnings;
}

void BaselineGridAlignerSettings::SetPreviewEnabled(bool enabled)
{
    fPreviewEnabled = enabled;
}

void BaselineGridAlignerSettings::ResetToDefaults()
{
    fHighlightColor = PMColor(0.5, 0.8, 1.0, 0.3);
    fAlignmentType = kAlignmentTypeTracking;
    fWordSpacingFactor = 1.0;
    fAutoApply = true;
    fShowWarnings = true;
    fPreviewEnabled = true;
}

std::unique_ptr<IPreferences> BaselineGridAlignerSettings::GetPreferences()
{
    InterfacePtr<ISession> session(GetExecutionContextSession());
    if (!session) return nullptr;
    
    InterfacePtr<IWorkspace> workspace(session->QueryWorkspace());
    if (!workspace) return nullptr;
    
    InterfacePtr<IPreferences> prefs(workspace->QueryPreferences());
    if (!prefs) return nullptr;
    
    // Navigate to our plugin's preference section
    prefs = prefs->QueryPreferences(kBaselineGridPluginID);
    if (!prefs) return nullptr;
    
    prefs = prefs->QueryPreferences(kBaselineGridAlignerSettingsKey);
    if (!prefs) {
        // Create if it doesn't exist
        prefs = Utils<IPreferenceUtils>()->CreatePreferences(
            workspace->QueryPreferences(), 
            kBaselineGridPluginID, 
            kBaselineGridAlignerSettingsKey);
    }
    
    return std::unique_ptr<IPreferences>(prefs.forget());
}

// Register implementation
CREATE_PMINTERFACE(BaselineGridAlignerSettings, kBaselineGridAlignerSettingsImpl)
