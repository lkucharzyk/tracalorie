class CalorieTracker{
    constructor(){
        this._calorieLimit = 2000;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];

        this._displayCalorieLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayProgressBar();
    }

    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._displayNewMeal(meal);
        this._renderStats();
    }
    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        this._displayNewWorkout(workout);
        this._renderStats();
    }

    removeMeal(id){
        const index = this._meals.findIndex(meal => meal.id == id);
        const meal = this._meals[index];
        this._totalCalories -= meal.calories;
        this._meals.splice(index, 1);
        console.log(this._meals);
        this._renderStats();
    }

    removeWorkout(id){
        const index = this._workouts.findIndex(workout => workout.id == id);
        const workout = this._workouts[index];
        this._totalCalories += workout.calories;
        this._workouts.splice(index, 1);
        console.log(this._workouts);
        this._renderStats();
    }

    _displayCaloriesTotal(){
        const totalCalEl = document.getElementById('calories-total');
        totalCalEl.innerText = this._totalCalories;
    }
    _displayCalorieLimit(){
        const limitEl = document.getElementById('calories-limit');
        limitEl.innerText = this._calorieLimit;
    }
    _displayCaloriesConsumed(){
        const consumedCalories = this._meals.reduce((acc, meal) => acc + meal.calories, 0);

        const consumedEl = document.getElementById('calories-consumed');
        consumedEl.innerText = consumedCalories;
    }
    _displayCaloriesBurned(){
        const burnedCalories = this._workouts.reduce((acc, workout) => acc + workout.calories, 0);

        const burnedEl = document.getElementById('calories-burned');
        burnedEl.innerText = burnedCalories;
    }
    _displayCaloriesRemaining(){
        const remainingCalories = this._calorieLimit - this._totalCalories;

        const remainingEl = document.getElementById('calories-remaining');
        const progresBarEl = document.getElementById('calorie-progress');

        remainingEl.innerText = remainingCalories;
        if(remainingCalories <= 0){
            remainingEl.parentElement.parentElement.classList.remove('bg-light');
            remainingEl.parentElement.parentElement.classList.add('bg-danger');

            progresBarEl.classList.remove('bg-success')
            progresBarEl.classList.add('bg-danger')
            
        }else{
            remainingEl.parentElement.parentElement.classList.remove('g-danger');
            remainingEl.parentElement.parentElement.classList.add('bg-light');

            progresBarEl.classList.remove('bg-danger')
            progresBarEl.classList.add('bg-success')
        }
    }


    _displayProgressBar(){
        const progresBarEl = document.getElementById('calorie-progress');
        const progresBarWidth = (this._totalCalories / this._calorieLimit) * 100;
        progresBarEl.style.width = progresBarWidth +'%';
    }

    _displayNewMeal(meal){
        const mealsEL = document.getElementById('meal-items');
        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2"');
        mealEl.setAttribute('data-id', meal.id);
        mealEl.innerHTML = `<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${meal.name}</h4>
          <div
            class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
          >
            ${meal.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>`
      mealsEL.appendChild(mealEl);

    }

    _displayNewWorkout(workout){
        const workoutsEL = document.getElementById('workout-items');
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2"');
        workoutEl.setAttribute('data-id', workout.id);
        workoutEl.innerHTML = ` <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
          <div
            class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
          >
          ${workout.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>`
      workoutsEL.appendChild(workoutEl);

    }

    _renderStats(){
        this._displayCaloriesTotal();
        this._displayCalorieLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayProgressBar()
    }
}

let nextMealId = 1;

class Meal{
    constructor(name, calories){
        this.id = nextMealId;
        nextMealId ++;
        this.name = name;
        this.calories = calories;
    }

}

let nextWorkoutId = 1;

class Workout{
    constructor(name, calories){
        this.id = nextWorkoutId;
        nextWorkoutId ++;
        this.name = name;
        this.calories = calories;
    }

}

class App{
    constructor(){
        this._tracker = new CalorieTracker();

        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));

        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));
        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));
    }

    _newItem(type, e){
        e.preventDefault();

        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);

        if(name.value === '' || calories.value === ''){
            alert('please fill in fields');
            return;
        }

        if(type === 'meal'){
            const meal = new Meal(name.value, +calories.value);
            this._tracker.addMeal(meal);
        }else{
            const workout = new Workout(name.value, +calories.value);
            this._tracker.addWorkout(workout);
        }

        name.value ='';
        calories.value ='';

        const collapseEl= document.getElementById(`collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseEl, {
            toggle: true
        }) 
    }

    _removeItem(type, e){
        if(e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')){
            if(confirm('are u sure')){
                const itemEl = e.target.closest('.card');
                const id = itemEl.getAttribute('data-id');

                type === 'meal' ? this._tracker.removeMeal(id) : this._tracker.removeWorkout(id);

                itemEl.remove();
            } 
        }
        
    }

}

const app = new App();

