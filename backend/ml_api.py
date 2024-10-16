from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Change this to match your frontend
    allow_credentials=True,
    allow_methods=["*"],  # This allows all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # This allows all headers
)

class ModelInput(BaseModel):
    Weight: float
    Height: float
    BMI: float
    Gender: int
    Age: int

# Loading saved model
exercise_model = pickle.load(open('exerciseRecommender.sav', 'rb'))

@app.post('/exercise_recommend')
def exercise_recom(input_parameters: ModelInput):
    input_data = input_parameters.json()
    input_dictionary = json.loads(input_data)

    weight = input_dictionary['Weight']
    height = input_dictionary['Height']
    bmi = input_dictionary['BMI']
    gender = input_dictionary['Gender']
    age = input_dictionary['Age']

    input_list = [weight, height, bmi, gender, age]
    prediction = exercise_model.predict([input_list])
    level = int(prediction.round(0))
    if level == 1:
        return {
            'recommendation': '''
            Exercise Plan:
            - Strength training: 2-3 times per week, focusing on compound exercises like squats, deadlifts, and bench presses.
            - Cardio: Light cardio 2 times per week, such as brisk walking or swimming for 20-30 minutes.
            - Flexibility: Gentle stretching daily for 10-15 minutes to maintain mobility.
            
            Diet Plan:
            - High-calorie, nutrient-dense diet with emphasis on healthy fats, complex carbohydrates, and proteins.
            - Frequent meals: Aim for 5-6 smaller meals throughout the day.
            - Protein-rich foods with every meal (eggs, lean meats, dairy, legumes).
            - Healthy fats from sources like avocados, nuts, seeds, and olive oil.
            - Calorie-dense smoothies with fruits, oats, and nut butters.
            - Stay hydrated with water and calorie-containing beverages like milk or 100% fruit juices.
            '''
        }
    elif level == 2:
        return {
            'recommendation': '''
            Exercise Plan:
            - Strength training: 2-3 times per week, incorporating both free weights and bodyweight exercises.
            - Cardio: Moderate intensity 2-3 times per week, such as jogging or cycling for 30 minutes.
            - Flexibility: Yoga or Pilates 1-2 times per week for overall body conditioning.
            
            Diet Plan:
            - Balanced diet with a slight calorie surplus (300-500 calories above maintenance).
            - Whole grains for sustained energy (oats, brown rice, quinoa).
            - Lean proteins with each meal (chicken, fish, tofu, eggs).
            - Healthy fats from sources like nuts, seeds, and avocados.
            - Nutrient-rich snacks between meals (greek yogurt with fruit, trail mix).
            - Hydrate well with water and consider adding electrolyte drinks if very active.
            '''
        }
    elif level == 3:
        return {
            'recommendation': '''
            Exercise Plan:
            - Strength training: 2-3 times per week, alternating between upper body and lower body workouts.
            - Cardio: 3-4 times per week, mix of high-intensity interval training (HIIT) and steady-state cardio for 30-45 minutes.
            - Flexibility: Dynamic stretching before workouts and static stretching post-workouts.
            
            Diet Plan:
            - Balanced diet with appropriate calories for weight maintenance.
            - Varied protein sources (lean meats, fish, plant-based proteins).
            - Complex carbohydrates for energy (whole grains, sweet potatoes).
            - Colorful array of fruits and vegetables for micronutrients.
            - Moderate healthy fats from olive oil, avocados, and nuts.
            - Stay hydrated with water (aim for 2-3 liters per day).
            '''
        }
    elif level == 4:
        return {
            'recommendation': '''
            Exercise Plan:
            - Strength training: 2-3 times per week, focusing on full-body workouts and compound movements.
            - Cardio: 4-5 times per week, mix of moderate-intensity activities like brisk walking or swimming for 45-60 minutes.
            - Flexibility: Yoga or stretching 2-3 times per week for stress relief and flexibility.
            
            Diet Plan:
            - Calorie-controlled diet with a slight deficit (300-500 calories below maintenance).
            - High-fiber foods to promote satiety (vegetables, legumes, whole grains).
            - Lean proteins with each meal to preserve muscle mass.
            - Limited refined carbohydrates and added sugars.
            - Portion control using smaller plates or measuring servings.
            - Mindful eating practices to avoid overeating.
            - Adequate hydration with water or unsweetened beverages.
            '''
        }
    elif level == 5:
        return {
            'recommendation': '''
            Exercise Plan:
            - Strength training: 2 times per week, starting with bodyweight exercises and progressing to light weights.
            - Cardio: 5 times per week, focus on low-impact activities like cycling or elliptical for 30-45 minutes.
            - Flexibility: Daily stretching routine focusing on major muscle groups.
            
            Diet Plan:
            - Structured meal plan with a moderate calorie deficit (500-750 calories below maintenance).
            - High-volume, low-calorie foods like vegetables and lean proteins to promote fullness.
            - Limited processed foods and sugary drinks.
            - Controlled portions of whole grains and healthy fats.
            - Regular meal times to establish a consistent eating pattern.
            - Food journaling to track intake and identify areas for improvement.
            - Increased water intake (aim for 3 liters per day) to support metabolism.
            '''
        }
    elif level == 6:
        return {
            'recommendation': '''
            Exercise Plan:
            - Strength training: 2 times per week using resistance bands or very light weights, focusing on proper form.
            - Cardio: Daily low-impact cardio like swimming or recumbent biking for 20-30 minutes, gradually increasing duration.
            - Flexibility: Gentle yoga or seated stretches daily to improve mobility and reduce joint stress.
            
            Diet Plan:
            - Supervised diet plan with significant calorie reduction (consult with a dietitian for specifics).
            - Emphasis on lean proteins and non-starchy vegetables at each meal.
            - Very limited refined carbohydrates and added sugars.
            - Small, frequent meals to manage hunger and blood sugar levels.
            - Consider meal replacement options under professional guidance.
            - Avoid liquid calories from sodas, juices, and alcohol.
            - Hydrate well with water or unsweetened tea (3-4 liters per day).
            '''
        }
    elif level == 7:
        return {
            'recommendation': '''
            Exercise Plan:
            - Strength training: 1-2 times per week using resistance bands or bodyweight exercises. Focus on major muscle groups.
            - Cardio: Low-impact, non-weight-bearing activities like aquatic therapy, recumbent biking, or gentle walking for 15-20 minutes, 3-4 times per week.
            - Flexibility: Daily stretching for 10-15 minutes to improve joint mobility and flexibility.
            
            Diet Plan:
            - Low-calorie, nutrient-dense diet focused on lean proteins, high-fiber vegetables, and moderate amounts of whole grains.
            - Avoid processed foods, sugary drinks, and high-sodium snacks.
            - Increase intake of high-fiber foods (whole grains, legumes, fruits, vegetables).
            - Drink water frequently (aim for 3-4 liters/day).
            - Consider meal replacement shakes under medical supervision.
            - Portion control: Use smaller plates and practice mindful eating.
            '''
        }
    else:
        return {'recommendation': 'Please consult with a healthcare professional for personalized advice.'}
    