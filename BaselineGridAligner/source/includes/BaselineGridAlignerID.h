#ifndef __BaselineGridAlignerID__
#define __BaselineGridAlignerID__

#include "PMTypes.h"
#include "ShuksanID.h"

// Plugin IDs
#define kBaselineGridPluginID                  0x0C0C0C0C
#define kBaselineGridAlignerImpl               0x0C0C0C0D
#define kBaselineGridAlignerPanelImpl          0x0C0C0C0E
#define kBaselineGridAlignerPanelWidgetImpl    0x0C0C0C0F
#define kBaselineGridAlignerSettingsImpl       0x0C0C0C10
#define kBaselineGridAlignerPreviewImpl        0x0C0C0C11
#define kBaselineGridAlignerCommandImpl        0x0C0C0C12

// Panel IDs
#define kBaselineGridAlignerPanelID            "cz.baselinegrid.panel"
#define kBaselineGridAlignerPanelWidgetID      "cz.baselinegrid.panelwidget"

// Command IDs
#define kBaselineGridAlignerAlignCmdBoss       kBaselineGridPluginID
#define kBaselineGridAlignerAlignCmdClass      kBaselineGridAlignerCommandImpl

// Settings Keys
#define kBaselineGridAlignerSettingsKey        "BaselineGridAlignerSettings"
#define kBaselineGridAlignerHighlightColorKey  "HighlightColor"
#define kBaselineGridAlignerAlignmentTypeKey   "AlignmentType"
#define kBaselineGridAlignerWordSpacingKey     "WordSpacing"
#define kBaselineGridAlignerAutoApplyKey       "AutoApply"
#define kBaselineGridAlignerShowWarningsKey    "ShowWarnings"
#define kBaselineGridAlignerPreviewEnabledKey  "PreviewEnabled"

// UI Constants
#define kBaselineGridAlignerPanelMinWidth      220
#define kBaselineGridAlignerPanelMinHeight     300
#define kBaselineGridAlignerPanelDefaultWidth  280
#define kBaselineGridAlignerPanelDefaultHeight 400

// Alignment Types
enum BaselineGridAlignmentType {
    kAlignmentTypeBaseline = 0,
    kAlignmentTypeTracking = 1,
    kAlignmentTypeWordSpacing = 2,
    kAlignmentTypeCombined = 3
};

// Progress Bar ID
#define kProgressBarID                         0x0C0C0C20

#endif // __BaselineGridAlignerID__
