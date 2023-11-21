import axios from "axios";

type Cars = {
  id: number;
  name: string;
  model:string;
  year: string
};

const carWrap = document.querySelector<HTMLDivElement>(".car-wrapper");




const drawCars = () => {
  carWrap.innerHTML = "";

axios.get("http://localhost:3004/cars/").then(({ data }) => {
    data.forEach((cars: Cars) => {
      carWrap.innerHTML += `
      <div class="car">
      <div></div>
      <h2 class="h2">${cars.name}</h2>
      <span>Model:${cars.model}</span>
      <span>Manufacture year:${cars.year}</span>
      <button class="js-car-delete" data-cars-id = ${cars.id}>Delete</button>
      </div>
      `;
    });
const deleteCarButton = document.querySelectorAll<HTMLButtonElement>('.js-car-delete')

deleteCarButton.forEach((carBtn:HTMLButtonElement)=>{
    carBtn.addEventListener('click', ()=>{
        const {carsId} = carBtn.dataset
        
        axios.delete(`http://localhost:3004/cars/${carsId}`).then(()=>{
            drawCars();
        })

    })
}) 


  });
};

drawCars();

const carForm = document.querySelector(".js-car-form");

carForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const carNameInput: HTMLInputElement =
    carForm.querySelector<HTMLInputElement>('input[name="car"]');
    const carModelInput: HTMLInputElement =
    carForm.querySelector<HTMLInputElement>('input[name="model"]');
    const carYearInput: HTMLInputElement =
    carForm.querySelector<HTMLInputElement>('input[name="manufacture-year"]');

  const carNameInputValue: string = carNameInput.value;
  const carModelInputValue: string = carModelInput.value;
   const carYearInputValue: string = carYearInput.value;

  axios
    .post("http://localhost:3004/cars", {
      name: carNameInputValue,
      model: carModelInputValue,
      year: carYearInputValue
    })
    .then(() => {
      carNameInput.value = "";
      carModelInput.value = "";
      carYearInput.value = "";
      drawCars();
    });
});
