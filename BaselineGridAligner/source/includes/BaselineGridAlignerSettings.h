#ifndef __BaselineGridAlignerSettings__
#define __BaselineGridAlignerSettings__

#include "IPMUnknown.h"
#include "BaselineGridAlignerID.h"
#include "PMReal.h"
#include "PMString.h"
#include "Utils.h"
#include "ISession.h"
#include "IWorkspace.h"
#include "IPreferenceUtils.h"
#include "IPreferences.h"
#include "PMColor.h"
#include <memory>

/**
 * @class BaselineGridAlignerSettings
 * 
 * Manages settings for the BaselineGridAligner plugin.
 * Uses std::unique_ptr for better memory management.
 */
class BaselineGridAlignerSettings : public CPMUnknown<IPMUnknown> {
public:
    BaselineGridAlignerSettings(IPMUnknown* boss);
    virtual ~BaselineGridAlignerSettings();

    // Load settings from preferences
    void LoadSettings();
    
    // Save settings to preferences
    void SaveSettings();
    
    // Getters
    PMColor GetHighlightColor() const { return fHighlightColor; }
    BaselineGridAlignmentType GetAlignmentType() const { return fAlignmentType; }
    PMReal GetWordSpacingFactor() const { return fWordSpacingFactor; }
    bool GetAutoApply() const { return fAutoApply; }
    bool GetShowWarnings() const { return fShowWarnings; }
    bool GetPreviewEnabled() const { return fPreviewEnabled; }
    
    // Setters
    void SetHighlightColor(const PMColor& color);
    void SetAlignmentType(BaselineGridAlignmentType type);
    void SetWordSpacingFactor(PMReal factor);
    void SetAutoApply(bool autoApply);
    void SetShowWarnings(bool showWarnings);
    void SetPreviewEnabled(bool enabled);
    
    // Reset to defaults
    void ResetToDefaults();

private:
    // Settings
    PMColor fHighlightColor;
    BaselineGridAlignmentType fAlignmentType;
    PMReal fWordSpacingFactor;
    bool fAutoApply;
    bool fShowWarnings;
    bool fPreviewEnabled;
    
    // Helper methods
    std::unique_ptr<IPreferences> GetPreferences();
};

#endif // __BaselineGridAlignerSettings__
