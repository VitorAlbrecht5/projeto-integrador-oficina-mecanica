import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdemServicoForm } from './ordem-servico-form';

describe('OrdemServicoForm', () => {
  let component: OrdemServicoForm;
  let fixture: ComponentFixture<OrdemServicoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdemServicoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdemServicoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
