#include <SDL_MAINLOOP.h>
#include <hardware.h>
#include <frontend.h>
#include <loader.h>

void setup(){
    size(WINDOW_WIDTH, WINDOW_HEIGHT);
    frameRate(REFRESH_RATE);
    setScaleMode(NEAREST);
    setTitle("ZX SPECTRUM");
    setWindowIcon("data/icon.bmp");
    initMenu();

    initAll();
    onExit = freeAll;
}

void loop(){
    const Uint8* keystate = SDL_GetKeyboardState(NULL);
    emulateKeyboard(keystate);
    switch(activeInputDevice){
        case KEMPSTON:
        emulateKempstonJoystick(keystate);
        break;

        case CURSOR:
        emulateCursorJoystick(keystate);
        break;

        default:
        break;
    }
    updateHotkeys(keystate);

    if(!emulationStopped)
        emulateHardware();
}

void ciao(){
    printf("CIAO!\n");
}