@echo off
REM Build script for BaselineGridAligner plugin on Windows
REM Requires Adobe InDesign SDK to be installed and INDESIGN_SDK_DIR environment variable to be set

if "%INDESIGN_SDK_DIR%"=="" (
    echo Error: INDESIGN_SDK_DIR environment variable is not set.
    echo Please set it to the path of your InDesign SDK installation.
    echo Example: set INDESIGN_SDK_DIR=C:\path\to\InDesignSDK
    exit /b 1
)

echo Building BaselineGridAligner plugin for InDesign 2024...

REM Create build directory
if not exist build mkdir build

REM Set compiler flags
set CXXFLAGS=/nologo /EHsc /std:c++17 /O2 /MD /D_WINDOWS /DWIN_ENV /DWIN64 /openmp
set INCLUDES=/I"%INDESIGN_SDK_DIR%\source\public" /I"%INDESIGN_SDK_DIR%\source\public\includes" /I"source" /I"source\includes"
set LIBPATH=/LIBPATH:"%INDESIGN_SDK_DIR%\build\win\release"
set LIBS=kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib Public.lib

REM Compile source files
cl.exe %CXXFLAGS% %INCLUDES% /c source\BaselineGridAligner.cpp /Fobuild\BaselineGridAligner.obj
cl.exe %CXXFLAGS% %INCLUDES% /c source\BaselineGridAlignerSettings.cpp /Fobuild\BaselineGridAlignerSettings.obj
cl.exe %CXXFLAGS% %INCLUDES% /c source\BaselineGridAlignerPanel.cpp /Fobuild\BaselineGridAlignerPanel.obj

REM Link object files
link.exe /DLL /OUT:build\BaselineGridAligner.dll build\BaselineGridAligner.obj build\BaselineGridAlignerSettings.obj build\BaselineGridAlignerPanel.obj %LIBPATH% %LIBS%

REM Create plugin directory structure
if not exist build\BaselineGridAligner mkdir build\BaselineGridAligner
if not exist build\BaselineGridAligner\win64 mkdir build\BaselineGridAligner\win64
if not exist build\BaselineGridAligner\Resources mkdir build\BaselineGridAligner\Resources

REM Copy files to plugin directory
copy build\BaselineGridAligner.dll build\BaselineGridAligner\win64\
copy resources\manifest.xml build\BaselineGridAligner\Resources\

echo Build completed successfully.
echo Plugin is located at: %CD%\build\BaselineGridAligner
echo.
echo To install the plugin, copy the BaselineGridAligner folder to:
echo C:\Program Files\Adobe\Adobe InDesign 2024\Plug-Ins
