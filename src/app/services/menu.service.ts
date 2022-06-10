import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
providedIn: 'root',
})
export class MenuService {
    
    @Output() menuClickedEvent = new EventEmitter<string>();

    menuClicked(menu: string) {
        this.menuClickedEvent.emit(menu);
    }
}
