# CASIO PV-1000 Documentation

This file contains all the information used to develop a simple emulator which can runs all the 13 released games.

## General

The casio PV-1000 is a fairly simple console, it consists of:

- a Z80 cpu
- a PSG with 3 square waves
- a single graphic mode VDP

## CPU and Memory Map

The cpu is a Z80 working in IM1 mode. In this mode, when an interrupt is pending and interrupts are enabled, the cpu performs a ``RST 0x38`` opcode.
I'll not cover all the information about the Z80 cpu, Internet is plenty of well written documentation.
About Memory Map, I didn't care a lot since no game requires on ram mirroring.

In my emulator I organized the memory map in this way:

| Address          | Hardware                 |
| ---------------- |------------------------- |
| ``0x0000-0x7FFF`` | cartridge is mapped here | 
| ``0x8000-0xFFFF`` | full r/w memory |

This is a semplification of the real hardware, since RAM wasn't so big.

## Interrupts

During a frame, 16 interrupts are fired.

Interrupts are fired at the end of the following scanlines:
195, 199, 203, 207, 211, 215, 219, 223, 227, 231, 235, 239, 243, 247, 251, 255

In an other way, if you don't like odd numbers, interrupts are fired at the beginning of the following scanlines:
196, 200, 204, 208, 212, 216, 220, 224, 228, 232, 236, 240, 244, 248, 252, 256

### Interrupt register status

In my emulator, bits marked as ``X`` are always 0.

```
I/O REG 0xFC READ ONLY
XXXXXXba
=> a : it is set after interrupt of line 196 is fired.
=> b : joypad status bit, for semplicity it is always set.

IMPORTANT: bit 'a' is reset after REG 0xFC is read.
MAME has a correct implementation of the joypad status bit.
```


## VDP (Video Display Controller)

The VDP works in a single graphic mode. It can disply a 30x24 grid of tiles. Each tiles is composed of 8x8 pixels. The color format for each pixel is RGB111 (1 bit per channel). Then, the game resolution is 240x192.

### Registers

```
I/O REG 0xFE WRITE ONLY
aaaaXXXX
=> ram_tile_addr = (aaaa11 << 10)
``` 

```
I/O REG 0xFF WRITE ONLY
bbbaXXXX
=> all_tiles_in_rom = a
=> rom_tile_addr = (bbb * 0x2000) 
```

### Tilemap

The tilemap is stored at address ``0xB800``. The tilemap, strangely, is a 32x24 grid. This means that the first two columns are ignored. Each entry of the tilemap indicates where to fetch the tile data. Each tile data occupy 32 bytes.

The algorithm to calculate the address of the tile data is the following:

```
u8 tile_idx = tilemap[x_grid + y_grid*32];
u8* tile_data;
if(tile_idx < 0xE0 || all_tiles_in_rom){
    tile_data = &memory[rom_tile_addr + tile_idx*32];
} else {
    tile_idx &= 0x1F;
    tile = &memory[ram_tile_addr + tile_idx*32];
}
``` 

### Tile Data

Each 8x8 tile is described by 32 bytes. Data are encoded as following:

- bytes from offset 0 to offset 7 are not unused
- bytes from offset 8 to offset 15 contains the red plane
- bytes from offset 16 to offset 23 contains the green plane
- bytes from offset 24 to offset 31 contains the blue plane

For each plane:
- Every plane is composed of 8 bytes.
- Each byte of the plane describe the channel intensity of a row of 8 pixels.
- Bit X of the row Y the describe the channel intensity of the pixel with coordinates (7-X, Y)

Fun fact: 25% of the VRAM is wasted.

## Controller

The controller is handheld by a single R/W register at address ``0xFD``. The read value depends on the last value written to this register.
Only values ``0b0000``, ``0b0001``, ``0b0010``, ``0b0100``, ``0b1000``, should be used.

The read value depends on this table:

| Written Value to 0xFD | Bit 0       | Bit 1       | Bit 2       | Bit 3       |
| --------------------- | ----------- | ----------- | ----------- | ----------- |
| 0b0001                | P1 Select   | P1 Start    | P2 Select   | P2 Start    |
| 0b0010                | P1 Down	  | P1 Right	| P2 Down	  | P2 Right    |
| 0b0100                | P1 Left	  | P1 Up	    | P2 Left	  | P2 Up       |
| 0b1000                | P1 Button 1 | P1 Button 2 | P2 Button 1 | P2 Button 2 |

## PSG

The PSG provides 3 square waves:

- Square 0
- Square 1, louder than Square 0 of 3db
- Square 2, louder than Square 1 of 3db

The PSG provides also a very primitive mixer.

```
I/0 REG 0xF8, 0xF9 0xFA WRITE ONLY
XXAAAAAA

0xF8 is for Square 0
0xF9 is for Square 1
0xFA is for Square 2

the frequency of the square wave is:
f = ASIC_FREQ / 1024 / (63-P)
where ASIC_FREQ is 17.897727e6 Hz
```

```
I/O REG 0xFB WRITE ONLY
XXXXXXEM
=> M : 0 = normal output
       1 = XOR modulation
=> E : 0 = sound mute
       1 = sound enabled
```

XOR modulation works as follows:

- Square0.output = Square0 ^ Square1
- Square1.output = Square1 ^ Square2
- Square2.output = Square2

## Some useful values about timings and resolution

| name | value |
| - | - |
| SCREEN_WIDTH | 224 |
| SCREEN_HEIGHT | 192 |
| CPU_CLOCK_HZ | 3579545 |
| REFRESH_RATE |  59.9227434 |
| CYCLES_PER_FRAME | 59736
| CYCLES_PER_LINE | 228 |
| TOTAL_SCANLINES | 262 |
| ASIC_FREQ | 17.897727e6 |


## References

References used:

- https://obscure.nesdev.org/wiki/Casio_PV-1000
- https://notes.world3.net/retro_computing/casio_pv-1000.html
- https://github.com/mamedev/mame/blob/mame0245/src/mame/drivers/pv1000.cpp

