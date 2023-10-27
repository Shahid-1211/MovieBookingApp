import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { Movie } from '../models/movie.model';
import { constants } from '../shared/constants';

describe('MovieService', () => {
  let movieService: MovieService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService],
    });

    movieService = TestBed.inject(MovieService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(movieService).toBeTruthy();
  });

  it('should handle errors in handleError method', () => {
    const errorMessage = 'Test error message';
    const errorResponse = { message: errorMessage };

    movieService['handleError']({ error: errorResponse } as any).subscribe({
      error: (error) => {
        expect(error).toEqual(new Error(errorMessage));
      },
    });
  });

  it('should get all movies', () => {
    movieService.getAllMovies().subscribe();

    const req = httpTestingController.expectOne(
      `${constants.MOVIE_CATALOG_SERVICE_URL}/all`
    );
    expect(req.request.method).toEqual('GET');
    req.flush({ movies: [] });
  });

  it('should get a movie by ID', () => {
    const movieId = '123';

    movieService.getMovieById(movieId).subscribe();

    const req = httpTestingController.expectOne(
      `${constants.MOVIE_CATALOG_SERVICE_URL}/movies/search/${movieId}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });
});
