import axios, { AxiosResponse } from "axios";
import { formatDistance, subDays } from 'date-fns';

type Cars = {
  id: number;
  name: string;
  model: string;
  year: string;
  image: string;
  date: Date | string;
};

const carWrap = document.querySelector<HTMLDivElement>(".car-wrapper");

const drawCars = () => {
  carWrap.innerHTML = "";
  const rtf1 = new Intl.RelativeTimeFormat('en', { style: 'short' });

  const title = document.querySelector('.h1') as HTMLHeadingElement;
  let titlesText = title.innerHTML;
  const check = axios.get("http://localhost:3004/cars/");

  check.then((s: AxiosResponse<Cars[]>) => {
    if (s.data.length === 0) {
      titlesText = '0 cars selected';
    } else {
      titlesText = 'car selection';
    }
    title.innerHTML = titlesText;
  });

  axios.get("http://localhost:3004/cars/").then(({ data }: AxiosResponse<Cars[]>) => {
    data.forEach((cars: Cars) => {
      let carName = cars.name.toLowerCase().trim();
      let defaultCarPicture = `<img src='assets/images/${carName}.jpg' alt='${carName}'>`;

      const newTime = new Date().getTime();
      const oldTime: any = cars.date;
      let timeDiff = (oldTime - newTime) / 1000; // Convert to seconds

      let typeOfDate: any = 'second';

      if (timeDiff < -60) {
        timeDiff /= 60; // Convert to minutes
        typeOfDate = 'minute';

        if (timeDiff < -60) {
          timeDiff /= 60; // Convert to hours
          typeOfDate = 'hour';

          if (timeDiff < -24) {
            timeDiff /= 24; // Convert to days
            typeOfDate = 'day';
          }
        }
      }

      const relTimeDiff = rtf1.format(Math.round(timeDiff), typeOfDate);

      carWrap.innerHTML += `
      <div class="car">
        <div class="car-img-wrap">
          ${defaultCarPicture}
        </div>
        <div class="car-specs-wrap">
          <p class="inputFlex"><span>Manufacturer:</span><span>${cars.name}</span></p>
          <p class="inputFlex"><span>Model:</span><span>${cars.model}</span></p>
          <p class="inputFlex"><span>Manufacture year:</span><span>${cars.year}</span></p>
          <p class="inputFlex"><span>Created: </span><span>${relTimeDiff}</span></p>
          <button class="js-car-delete" data-cars-id=${cars.id}>Delete</button>
        </div>
      </div>
      `;
    });

    const deleteCarButton = document.querySelectorAll<HTMLButtonElement>('.js-car-delete');

    deleteCarButton.forEach((carBtn: HTMLButtonElement) => {
      carBtn.addEventListener('click', () => {
        const { carsId } = carBtn.dataset;

        axios.delete(`http://localhost:3004/cars/${carsId}`).then(() => {
          drawCars();
        });
      });
    });
  });
};

drawCars();

const carForm = document.querySelector(".js-car-form") as HTMLFormElement;

carForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const carNameInput: HTMLInputElement = carForm.querySelector<HTMLInputElement>('input[name="car"]')!;
  const carModelInput: HTMLInputElement = carForm.querySelector<HTMLInputElement>('input[name="model"]')!;
  const carYearInput: HTMLInputElement = carForm.querySelector<HTMLInputElement>('input[name="manufacture-year"]')!;

  const carNameInputValue: string = carNameInput.value;
  const carModelInputValue: string = carModelInput.value;
  const carYearInputValue: string = carYearInput.value;
  const createdAt = new Date().getTime();

  axios
    .post("http://localhost:3004/cars", {
      name: carNameInputValue,
      model: carModelInputValue,
      year: carYearInputValue,
      date: createdAt,
    })
    .then(() => {
      carNameInput.value = "";
      carModelInput.value = "";
      carYearInput.value = "";
      drawCars();
    });
});
