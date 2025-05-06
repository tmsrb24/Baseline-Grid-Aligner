#ifndef __DPIScaler__
#define __DPIScaler__

#include "PMReal.h"
#include "IDeviceUtils.h"
#include "Utils.h"

/**
 * @class DPIScaler
 * 
 * Utility class for handling dynamic DPI scaling in the UI.
 * Ensures UI elements are properly sized across different display resolutions.
 */
class DPIScaler {
public:
    // Get the current DPI scale factor
    static PMReal GetScale() {
        return Utils<IDeviceUtils>()->GetDPIScale();
    }
    
    // Scale a value based on current DPI
    static PMReal Scale(PMReal value) {
        return value * GetScale();
    }
    
    // Scale an integer value based on current DPI
    static int32 ScaleInt(int32 value) {
        return static_cast<int32>(Scale(static_cast<PMReal>(value)));
    }
    
    // Get a value that's appropriate for the current DPI
    // Chooses between different values based on DPI ranges
    static PMReal GetDPIAppropriateValue(PMReal lowDPIValue, PMReal highDPIValue) {
        PMReal scale = GetScale();
        if (scale <= 1.0) {
            return lowDPIValue;
        } else if (scale <= 1.5) {
            return PMReal::Lerp(lowDPIValue, highDPIValue, (scale - 1.0) / 0.5);
        } else {
            return highDPIValue;
        }
    }
    
    // Get an integer value that's appropriate for the current DPI
    static int32 GetDPIAppropriateInt(int32 lowDPIValue, int32 highDPIValue) {
        PMReal scale = GetScale();
        if (scale <= 1.0) {
            return lowDPIValue;
        } else if (scale <= 1.5) {
            PMReal factor = (scale - 1.0) / 0.5;
            return static_cast<int32>(PMReal::Lerp(
                static_cast<PMReal>(lowDPIValue), 
                static_cast<PMReal>(highDPIValue), 
                factor));
        } else {
            return highDPIValue;
        }
    }
};

#endif // __DPIScaler__
