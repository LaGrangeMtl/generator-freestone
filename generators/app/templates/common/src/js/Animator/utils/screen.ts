import {
	SCREEN_TOP, SCREEN_CENTER, SCREEN_BOTTOM, SCREEN_RIGHT, SCREEN_H_CENTER, SCREEN_LEFT, 
} from '../Constants';

export const screen = {};

export function updateScreen() {
	screen[SCREEN_TOP] = 0;
	screen[SCREEN_CENTER] = (window.innerHeight / 2);
	screen[SCREEN_BOTTOM] = window.innerHeight;
	
	screen[SCREEN_LEFT] = 0;
	screen[SCREEN_H_CENTER] = (window.innerWidth / 2);
	screen[SCREEN_RIGHT] = window.innerWidth;
}

updateScreen();
