class CalorieTracker{
    constructor(){
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories();
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        this._displayCalorieLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayProgressBar();
        this._meals.forEach( meal =>  this._displayNewMeal(meal));
        this._workouts.forEach( workout =>  this._displayNewWorkout(workout));
    }

    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.saveMeal(meal);
        this._displayNewMeal(meal);
        this._renderStats();
    }
    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.saveWorkout(workout);
        this._displayNewWorkout(workout);
        this._renderStats();
    }

    removeMeal(id){
        const index = this._meals.findIndex(meal => meal.id == id);
        const meal = this._meals[index];
        this._totalCalories -= meal.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.removeMeal(id);
        this._meals.splice(index, 1);
        console.log(this._meals);
        this._renderStats();
    }

    removeWorkout(id){
        const index = this._workouts.findIndex(workout => workout.id == id);
        const workout = this._workouts[index];
        this._totalCalories += workout.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.removeWorkout(id);
        this._workouts.splice(index, 1);
        console.log(this._workouts);
        this._renderStats();
    }

    reset(){
        this._totalCalories = 0;
        Storage.setTotalCalories(this._totalCalories);
        this._meals = [];
        this._workouts = [];
        this._renderStats();
        localStorage.clear();
    }

    setLimit(limit){
        this._calorieLimit = limit;
        Storage.setCalorieLimit(limit);
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
        this._displayProgressBar();
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

class Storage{
    static getCalorieLimit(defaultLimit = 2000){
        let calorieLimit;
        if(!localStorage.getItem('CalorieLimit')){
            calorieLimit = defaultLimit;
        }else{
            calorieLimit = +localStorage.getItem('CalorieLimit');
        }
        return calorieLimit;
    }
    static setCalorieLimit(limit){
       localStorage.setItem('CalorieLimit', limit);
    }

    static getTotalCalories(defaultTotal = 0){
        let totalCalories;
        if(!localStorage.getItem('TotalCalories')){
            totalCalories = defaultTotal;
        }else{
            totalCalories = +localStorage.getItem('TotalCalories');
        }
        return totalCalories;
    }
    static setTotalCalories(totalCalories){
       localStorage.setItem('TotalCalories', totalCalories);
    }

    static getMeals(){
        let meals;
        if(!localStorage.getItem('meals')){
            meals = [];
        }else{
            meals = JSON.parse(localStorage.getItem('meals'));
        }
        return meals;
    }

    static saveMeal(meal){
        const meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static getWorkouts(){
        let workouts;
        if(!localStorage.getItem('workouts')){
            workouts = [];
        }else{
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }
        return workouts;
    }
    static saveWorkout(workout){
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static removeMeal(id){
        const meals = Storage.getMeals();
        const index = meals.indexOf(meals.filter(meal => meal.id ===  id));
        meals.splice(index, 1);
        localStorage.setItem('meals', JSON.stringify(meals));
    }
    static removeWorkout(id){
        const workouts = Storage.getWorkouts();
        const index = workouts.indexOf(workouts.filter(workout => workout.id ===  id));
        workouts.splice(index, 1);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

}

class App{
    constructor(){
        this._tracker = new CalorieTracker();

        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));

        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));
        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));

        document.getElementById('filter-meals').addEventListener('keyup', this._filterItems.bind(this));
        document.getElementById('filter-workouts').addEventListener('keyup', this._filterItems.bind(this));

        document.getElementById('reset').addEventListener('click', this._reset.bind(this));

        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
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

    _filterItems(e){
        const input = e.target.value.toLowerCase();
        let items;
        e.target.getAttribute('id') === 'filter-meals' ? items = document.querySelectorAll('#meal-items h4') : items = document.querySelectorAll('#workout-items h4');
        items.forEach(item =>{
            if(!item.innerHTML.toLowerCase().startsWith(input)){
                item.parentNode.parentNode.parentNode.style.display = 'none';
            }else{
                item.parentNode.parentNode.parentNode.style.display = 'flex';
            }
        })
    }

    _setLimit(e){
        e.preventDefault();
        const limitField = document.getElementById('limit');

        if(limitField.value === ''){
            alert('please fill in field');
            return;
        }
        this._tracker.setLimit(+limitField.value);
        limitField.value = '';

        const modalEl = document.getElementById('limit-modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    }

    _reset(){
        this._tracker.reset();

        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';

        document.getElementById('filter-meals').value = '';
        document.getElementById('filter-workouts').value = '';
    }

}

const app = new App();

