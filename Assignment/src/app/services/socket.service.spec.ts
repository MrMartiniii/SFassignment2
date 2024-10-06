import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';

describe('ServicesComponent', () => {
  let component: SocketService;
  let fixture: ComponentFixture<SocketService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocketService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocketService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
