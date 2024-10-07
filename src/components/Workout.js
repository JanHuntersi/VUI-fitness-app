import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Workout() {
  const { workoutId } = useParams();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newWorkoutId, setNewWorkoutId] = useState(null);
  const [newExerciseId, setNewExerciseId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/userInfo.json');
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`);
      }
      const data = await res.json();
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching userInfo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));

      if (workoutId === 'new') {
        const lastWorkoutId = Object.keys(JSON.parse(storedUserInfo).workouts).reduce((max, id) => Math.max(max, parseInt(id)), 0);
        setNewWorkoutId(lastWorkoutId + 1);
        setNewExerciseId(1);

        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          workouts: {
            ...prevUserInfo.workouts,
            [newWorkoutId]: {
              name: '',
              exercises: {
                [newExerciseId]: {
                  name: '',
                  sets: [0, 0, 0, 0],
                },
              },
            },
          },
        }));
      } else {
        const lastExerciseId = Object.keys(JSON.parse(storedUserInfo).workouts[workoutId].exercises).reduce(
          (max, id) => Math.max(max, parseInt(id)),
          0
        );
        console.log(lastExerciseId);
        setNewExerciseId(lastExerciseId + 1);
      }

      setLoading(false);
    } else {
      fetchData();
    }
  }, [newWorkoutId, workoutId]);

  const handleNameChange = (e) => {
    const workout = workoutId === 'new' ? newWorkoutId : workoutId;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      workouts: {
        ...prevUserInfo.workouts,
        [workout]: {
          ...prevUserInfo.workouts[workout],
          name: e.target.value,
        },
      },
    }));
  };

  const handleExerciseNameChange = (e, exerciseId) => {
    const workout = workoutId === 'new' ? newWorkoutId : workoutId;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      workouts: {
        ...prevUserInfo.workouts,
        [workout]: {
          ...prevUserInfo.workouts[workout],
          exercises: {
            ...prevUserInfo.workouts[workout].exercises,
            [exerciseId]: {
              ...prevUserInfo.workouts[workout].exercises[exerciseId],
              name: e.target.value,
            },
          },
        },
      },
    }));
  };

  const handleRepsChange = (e, exerciseId, setIndex) => {
    const workout = workoutId === 'new' ? newWorkoutId : workoutId;
    const newValue = parseInt(e.target.value);
    setIndex = parseInt(setIndex);

    if (newValue < 0) return;

    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      workouts: {
        ...prevUserInfo.workouts,
        [workout]: {
          ...prevUserInfo.workouts[workout],
          exercises: {
            ...prevUserInfo.workouts[workout].exercises,
            [exerciseId]: {
              ...prevUserInfo.workouts[workout].exercises[exerciseId],
              sets: prevUserInfo.workouts[workout].exercises[exerciseId].sets.map((reps, index) => (index === setIndex ? newValue : reps)),
            },
          },
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    navigate('/profile');
  };

  const addExercise = () => {
    const workout = workoutId === 'new' ? newWorkoutId : workoutId;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      workouts: {
        ...prevUserInfo.workouts,
        [workout]: {
          ...prevUserInfo.workouts[workout],
          exercises: {
            ...prevUserInfo.workouts[workout].exercises,
            [newExerciseId + 1]: {
              name: '',
              sets: [0, 0, 0, 0],
            },
          },
        },
      },
    }));
    setNewExerciseId(newExerciseId + 1);
  };

  useEffect(() => {
    console.log(newExerciseId);
  }, [newExerciseId]);

  return (
    <div className='m-8'>
      {loading ? (
        <div>Loading ...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <h2 className='text-xl font-semibold leading-7 text-gray-900 mb-6'>Workout Name</h2>
            <input
              type='text'
              className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 rounded-md shadow-sm ring-1 ring-inset ring-gray-300'
              value={userInfo.workouts[workoutId]?.name}
              onChange={handleNameChange}
              required
              name='name'
              id='name'
            />

            <div className='flex gap-4 pt-4'>
              <h2 className='text-xl font-semibold leading-7 text-gray-900 my-auto'>Exercises</h2>
              <button
                type='button'
                onClick={() => addExercise()}
                className='rounded-md bg-indigo-600 px-5 py-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                +
              </button>
            </div>

            <div className='grid grid-cols-5 mt-4'>
              <div className='text-l font-semibold'>Exercise name</div>
              <div className='col-span-4 text-l font-semibold'>Sets and reps</div>
            </div>

            {userInfo && userInfo.workouts && (
              <div>
                {workoutId === 'new' ? (
                  <div>
                    {userInfo.workouts[newWorkoutId]?.exercises &&
                      Object.keys(userInfo.workouts[newWorkoutId].exercises).map((exercise) => (
                        <div className='mb-2 grid grid-cols-5 gap-2' key={exercise}>
                          <input
                            type='text'
                            className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 rounded-md shadow-sm ring-1 ring-inset ring-gray-300'
                            value={userInfo.workouts[newWorkoutId].exercises[exercise].name}
                            onChange={(e) => handleExerciseNameChange(e, exercise)}
                          />
                          {/* set reps here */}
                          {userInfo.workouts[newWorkoutId].exercises[exercise].sets &&
                            Object.entries(userInfo.workouts[newWorkoutId].exercises[exercise].sets).map(([setIndex, reps]) => (
                              <input
                                type='number'
                                className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 rounded-md shadow-sm ring-1 ring-inset ring-gray-300'
                                key={`${exercise}-${setIndex}`}
                                value={reps}
                                onChange={(e) => handleRepsChange(e, exercise, setIndex)}
                              />
                            ))}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div>
                    {userInfo.workouts[workoutId]?.exercises &&
                      Object.keys(userInfo.workouts[workoutId].exercises).map((exercise) => (
                        <div className='mb-2 grid grid-cols-5 gap-2' key={exercise}>
                          <input
                            type='text'
                            className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 rounded-md shadow-sm ring-1 ring-inset ring-gray-300'
                            value={userInfo.workouts[workoutId].exercises[exercise].name}
                            onChange={(e) => handleExerciseNameChange(e, exercise)}
                          />
                          {/* set reps here */}
                          {userInfo.workouts[workoutId].exercises[exercise].sets &&
                            Object.entries(userInfo.workouts[workoutId].exercises[exercise].sets).map(([setIndex, reps]) => (
                              <input
                                className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 rounded-md shadow-sm ring-1 ring-inset ring-gray-300'
                                type='number'
                                key={`${exercise}-${setIndex}`}
                                value={reps}
                                onChange={(e) => handleRepsChange(e, exercise, setIndex)}
                              />
                            ))}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className='mt-6 flex items-center justify-end gap-x-6'>
            <button
              type='submit'
              className='rounded-md bg-indigo-600 px-5 py-2 text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Save Workout
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Workout;
