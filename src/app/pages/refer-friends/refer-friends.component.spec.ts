import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferFriendsComponent } from './refer-friends.component';

describe('ReferFriendsComponent', () => {
  let component: ReferFriendsComponent;
  let fixture: ComponentFixture<ReferFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferFriendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
