const { useState, useEffect } = React;

const StrongLiftsApp = () => {
  const [currentWorkout, setCurrentWorkout] = useState('Leg A');
  const [exercises, setExercises] = useState({
    'Leg A': [
      { name: 'Hack Squat', sets: 3, reps: 10, weight: 45 },
      { name: 'Leg Press', sets: 3, reps: 10, weight: 45 },
      { name: 'Romanian Deadlift', sets: 3, reps: 10, weight: 45 },
      { name: 'Clamshell', sets: 3, reps: 10, weight: 0 }
    ],
    'Pull': [
      { name: 'Pullups', sets: 3, reps: 12, weight: 0 },
      { name: 'T-Bar Row', sets: 3, reps: 10, weight: 45 },
      { name: 'Hammer Curl', sets: 3, reps: 12, weight: 15 },
      { name: 'Dumbbell Row', sets: 3, reps: 12, weight: 30 },
      { name: 'Incline Curl', sets: 3, reps: 12, weight: 15 },
      { name: 'Y Raise', sets: 3, reps: 15, weight: 5 },
      { name: 'Rear Fly', sets: 3, reps: 15, weight: 10 }
    ],
    'Push': [
      { name: 'Incline Bench', sets: 3, reps: 12, weight: 45 },
      { name: 'Flat Bench', sets: 3, reps: 10, weight: 45 },
      { name: 'Lateral Raise', sets: 3, reps: 15, weight: 10 },
      { name: 'Dips', sets: 2, reps: 12, weight: 0 },
      { name: 'Skull Crusher', sets: 3, reps: 12, weight: 25 },
      { name: 'Dumbbell Fly', sets: 2, reps: 12, weight: 20 }
    ],
    'Leg B': [
      { name: 'Hack Squat', sets: 3, reps: 10, weight: 45 },
      { name: 'Leg Press', sets: 3, reps: 10, weight: 45 },
      { name: 'Romanian Deadlift', sets: 3, reps: 10, weight: 45 },
      { name: 'Clamshell', sets: 3, reps: 10, weight: 0 }
    ],
    'Upper Body': [
      { name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 30 },
      { name: 'Dumbbell Bench', sets: 2, reps: 10, weight: 35 },
      { name: 'T-Bar Row', sets: 3, reps: 10, weight: 45 },
      { name: 'Pullup', sets: 2, reps: 8, weight: 0 },
      { name: 'Lateral Raise', sets: 3, reps: 15, weight: 10 },
      { name: 'Barbell Curl', sets: 3, reps: 12, weight: 25 },
      { name: 'Skull Crusher', sets: 3, reps: 12, weight: 25 }
    ]
  });

  const [workoutLog, setWorkoutLog] = useState([]);
  const [currentSet, setCurrentSet] = useState({ exerciseIndex: 0, setNumber: 1 });
  const [completedSets, setCompletedSets] = useState({});
  const [restTimer, setRestTimer] = useState({ active: false, seconds: 0 }); // Start at 0:00
  // Load data from localStorage on mount
  useEffect(() => {
    const savedExercises = localStorage.getItem('stronglifts-exercises');
    
    if (savedExercises) {
      setExercises(JSON.parse(savedExercises));
    }
  }, []);

  // Save exercises to localStorage when they change
  useEffect(() => {
    localStorage.setItem('stronglifts-exercises', JSON.stringify(exercises));
  }, [exercises]);

  // Rest timer effect
  useEffect(() => {
    let interval;
    if (restTimer.active) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          return { ...prev, seconds: prev.seconds + 1 };
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [restTimer.active]);

  const updateWeight = (workoutType, exerciseIndex, newWeight) => {
    const newExercises = { ...exercises };
    newExercises[workoutType][exerciseIndex].weight = newWeight;
    setExercises(newExercises);
  };

  const completeSet = () => {
    const exerciseKey = `${currentWorkout}-${currentSet.exerciseIndex}`;
    const newCompletedSets = { ...completedSets };
    
    if (!newCompletedSets[exerciseKey]) {
      newCompletedSets[exerciseKey] = [];
    }
    newCompletedSets[exerciseKey].push(currentSet.setNumber);
    setCompletedSets(newCompletedSets);
    
    // Start rest timer
    setRestTimer({ active: true, seconds: 0 });
    
    // Move to next set
    const currentExercise = exercises[currentWorkout][currentSet.exerciseIndex];
    if (currentSet.setNumber < currentExercise.sets) {
      setCurrentSet({ ...currentSet, setNumber: currentSet.setNumber + 1 });
    } else if (currentSet.exerciseIndex < exercises[currentWorkout].length - 1) {
      setCurrentSet({ exerciseIndex: currentSet.exerciseIndex + 1, setNumber: 1 });
    } else {
      // Workout complete
      setCurrentSet({ exerciseIndex: 0, setNumber: 1 });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetExerciseSets = (exerciseIndex) => {
    const exerciseKey = `${currentWorkout}-${exerciseIndex}`;
    const newCompletedSets = { ...completedSets };
    newCompletedSets[exerciseKey] = [];
    setCompletedSets(newCompletedSets);
  };

  const calculatePlates = (weight) => {
    const barWeight = 45;
    const targetWeight = weight - barWeight;
    const plates = [45, 25, 10, 5, 2.5];
    const plateCount = {};
    
    let remaining = targetWeight / 2; // Per side
    
    plates.forEach(plate => {
      const count = Math.floor(remaining / plate);
      if (count > 0) {
        plateCount[plate] = count;
        remaining -= count * plate;
      }
    });
    
    return plateCount;
  };

  const getVisualBarbell = (weight) => {
    const plates = calculatePlates(weight);
    const plateOrder = [45, 25, 10, 5, 2.5];
    
    return (
      <div className="flex items-center justify-center py-6">
        {/* One side of barbell */}
        <div className="flex items-center">
          {/* Barbell sleeve */}
          <div className="w-16 h-4 bg-gray-400 relative">
            <div className="absolute -top-0.5 left-0 w-3 h-5 bg-gray-500 rounded-l"></div>
          </div>
          
          {/* Plates */}
          <div className="flex items-center">
            {plateOrder.map(plateWeight => {
              const count = plates[plateWeight] || 0;
              return (
                <div key={`plate-${plateWeight}`} className="flex">
                  {Array.from({ length: count }, (_, i) => (
                    <div
                      key={`plate-${plateWeight}-${i}`}
                      className={`border-2 border-yellow-400 flex items-center justify-center text-white font-bold text-xs overflow-hidden ${
                        plateWeight === 45 ? 'w-8 h-16 bg-red-600' :
                        plateWeight === 25 ? 'w-6 h-14 bg-blue-600' :
                        plateWeight === 10 ? 'w-4 h-12 bg-green-600' :
                        plateWeight === 5 ? 'w-4 h-10 bg-yellow-600' :
                        'w-3 h-8 bg-gray-600'
                      } rounded-r-sm -ml-px`}
                      title={`${plateWeight}lb`}
                    >
                      {plateWeight}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const calculateWarmup = (workWeight) => {
    const warmupSets = [
      { reps: 5, weight: Math.round(workWeight * 0.4) },
      { reps: 5, weight: Math.round(workWeight * 0.6) },
      { reps: 3, weight: Math.round(workWeight * 0.8) },
      { reps: 2, weight: Math.round(workWeight * 0.9) }
    ];
    return warmupSets;
  };

  const currentExercise = exercises[currentWorkout][currentSet.exerciseIndex];

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Desktop 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Workout Selection */}
            <div className="bg-black border-2 border-yellow-400 rounded-lg p-6 shadow-lg shadow-yellow-400/20">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400 tracking-wide">SELECT WORKOUT</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(exercises).map((workout) => (
                  <button
                    key={workout}
                    onClick={() => {
                      setCurrentWorkout(workout);
                      setCurrentSet({ exerciseIndex: 0, setNumber: 1 });
                    }}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-all transform hover:scale-105 tracking-wide ${
                      currentWorkout === workout 
                        ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/50' 
                        : 'bg-gray-900 text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400 hover:text-black'
                    }`}
                  >
                    {workout}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Exercise */}
            <div className="bg-black border-2 border-yellow-400 rounded-lg p-6 shadow-lg shadow-yellow-400/20">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400 tracking-wide">CURRENT EXERCISE</h2>
              
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Exercise Info & Set Tracker */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-yellow-400 mb-3 tracking-wider truncate">{currentExercise.name}</h3>
                    <p className="text-xl text-yellow-400/80 tracking-wide">
                      SET {currentSet.setNumber} OF {currentExercise.sets} • {currentExercise.reps} REPS
                    </p>
                  </div>

                  {/* Rest Timer */}
                  <div className="bg-yellow-400 text-black border-2 border-yellow-300 rounded-lg p-4 text-center">
                    <h4 className="text-2xl font-bold mb-2 tracking-wide">REST TIMER</h4>
                    <div className="text-4xl font-bold tracking-wider">{formatTime(restTimer.seconds)}</div>
                    <p className="text-sm font-medium tracking-wide">
                      {restTimer.active ? 'REST IN PROGRESS' : 'REST TIMER READY'}
                    </p>
                  </div>
                  
                  {/* Visual Set Tracker */}
                  <div className="flex justify-center gap-3">
                    {Array.from({ length: currentExercise.sets }, (_, i) => {
                      const exerciseKey = `${currentWorkout}-${currentSet.exerciseIndex}`;
                      const isCompleted = completedSets[exerciseKey]?.includes(i + 1);
                      const isCurrent = currentSet.setNumber === i + 1;
                      
                      return (
                        <button
                          key={i}
                          className={`w-12 h-12 rounded-full font-bold text-lg transition-all transform hover:scale-110 border-2 ${
                            isCompleted 
                              ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-600/50' 
                              : isCurrent
                              ? 'bg-yellow-400 text-black border-yellow-300 shadow-lg shadow-yellow-400/50'
                              : 'bg-gray-900 text-yellow-400 border-yellow-400/30 hover:bg-yellow-400 hover:text-black'
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>
                
                <button
                  onClick={() => resetExerciseSets(currentSet.exerciseIndex)}
                  className="text-sm text-yellow-400/60 hover:text-yellow-400 mb-6 tracking-wide"
                >
                  RESET ALL SETS
                </button>
                </div>

                {/* Right Column - Weight & Controls */}
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-yellow-400 tracking-wider">
                      {currentExercise.weight} LBS
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => updateWeight(currentWorkout, currentSet.exerciseIndex, currentExercise.weight - 5)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold tracking-wide transform hover:scale-105 transition-all text-sm"
                    >
                      -5 LBS
                    </button>
                    <button
                      onClick={() => updateWeight(currentWorkout, currentSet.exerciseIndex, currentExercise.weight + 5)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold tracking-wide transform hover:scale-105 transition-all text-sm"
                    >
                      +5 LBS
                    </button>
                  </div>

                  {/* Plate Calculator */}
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-center text-yellow-400 tracking-wide">PLATE CALCULATOR</h3>
                    <div className="text-center">
                      {/* Visual Barbell */}
                      <div className="bg-gray-900 border border-yellow-400/30 rounded-lg p-4">
                        {getVisualBarbell(currentExercise.weight)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete Set Button - Full Width */}
              <button
                onClick={completeSet}
                className="w-full py-4 bg-yellow-400 text-black text-xl font-bold rounded-lg hover:bg-yellow-300 transition-all transform hover:scale-105 tracking-wide shadow-lg shadow-yellow-400/50 mt-6"
              >
                COMPLETE SET
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Today's Workout */}
            <div className="bg-black border-2 border-yellow-400 rounded-lg p-6 shadow-lg shadow-yellow-400/20">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400 tracking-wide">TODAY'S WORKOUT</h2>
              <div className="space-y-3">
                {exercises[currentWorkout].map((exercise, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSet({ exerciseIndex: index, setNumber: 1 })}
                    className={`w-full flex justify-between items-center p-4 rounded-lg transition-all transform hover:scale-102 border-2 ${
                      index === currentSet.exerciseIndex 
                        ? 'bg-yellow-400 text-black border-yellow-300 shadow-lg shadow-yellow-400/50' 
                        : 'bg-gray-900 text-yellow-400 border-yellow-400/30 hover:bg-yellow-400 hover:text-black'
                    }`}
                  >
                    <span className="font-bold tracking-wide">{exercise.name}</span>
                    <span className="font-bold tracking-wide">{exercise.sets} × {exercise.reps} @ {exercise.weight} LBS</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <h1 className="text-6xl font-bold text-center mb-8 text-yellow-400 tracking-wider">WILL'S HYPERTROPHY PROGRAM</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<StrongLiftsApp />);
