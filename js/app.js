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
        this._renderStats();
    }
    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
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


const tracker = new CalorieTracker();

const brekfast = new Meal('brekfast', 400);
tracker.addMeal(brekfast);

const brekfast2 = new Meal('brekfast2', 500);
tracker.addMeal(brekfast2);

const diner = new Meal('diner', 900);
tracker.addMeal(diner);

const pushups = new Workout('pushups', 300);
tracker.addWorkout(pushups);

const sranie = new Workout('sranie', 100);
tracker.addWorkout(sranie);
