import { TestBed, inject } from '@angular/core/testing';
import { SceneService } from './scene.service';

describe('SceneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SceneService]
    });
  });

  it('should ...', inject([SceneService], (service: SceneService) => {
    expect(service).toBeTruthy();
  }));
});
