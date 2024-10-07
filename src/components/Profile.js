import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  const findUser = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.map((userItem) => {
      if (user.email === userItem.email) {
        setUserData(userItem);
      }
    });
  };

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
      setLoading(false);
    } else {
      fetchData();
    }
    findUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

  const removeWorkout = (workoutId) => {
    const confirmed = window.confirm(`Are you sure you want to delete workout ${userInfo.workouts[workoutId].name}?`);
    if (confirmed) {
      const updatedUserInfo = userInfo;
      delete updatedUserInfo.workouts[workoutId];
      fetchData();
    }
  };

  return (
    <div className='m-8'>
      {loading ? (
        <div> Loading ... </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className='bg-white p-6 rounded-lg shadow-xl border border-gray-300'>
            <div className=''>
              <h2 className='text-xl font-semibold leading-7 text-gray-900'>Profile</h2>
              <div className='mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-6'>
                <div className='sm:col-span-3'>
                  <label htmlFor='userName' className='block text-sm font-medium leading-6 text-gray-900'>
                    Username
                  </label>
                  <div className='mt-2'>
                    <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                      <input
                        name='userName'
                        id='userName'
                        className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                        value={userInfo.userName || ''}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className='sm:col-span-3'>
                  <label htmlFor='photo' className='block text-sm font-medium leading-6 text-gray-900'>
                    Photo
                  </label>
                  <div className='mt-2 flex items-center gap-x-3'>
                    <UserCircleIcon className='h-12 w-12 text-gray-300' aria-hidden='true' />
                    <button
                      type='button'
                      className='rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-span-full'>
              <label htmlFor='about' className='block text-sm font-medium leading-6 text-gray-900'>
                About
              </label>
              <div className='mt-2'>
                <textarea
                  id='description'
                  name='description'
                  rows={3}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  defaultValue={userInfo.description || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <p className='mt-3 text-sm leading-6 text-gray-600'>Write a few sentences about yourself.</p>
            </div>

            <div className='border-b border-gray-900/10 pb-12'>
              <h2 className='text-base font-semibold leading-8 mt-6 text-gray-900'>Personal Information</h2>
              <p className='mt-1 text-sm leading-6 text-gray-600'>Here you can see and update your personal information.</p>

              <div className='mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-6'>
                <div className='sm:col-span-3'>
                  <label htmlFor='name' className='block text-sm font-medium leading-6 text-gray-900'>
                    First name
                  </label>
                  <div className='mt-2'>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      required
                      value={userInfo.name || ''}
                      onChange={handleChange}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>

                <div className='sm:col-span-3'>
                  <label htmlFor='surname' className='block text-sm font-medium leading-6 text-gray-900'>
                    Last name
                  </label>
                  <div className='mt-2'>
                    <input
                      required
                      type='text'
                      name='surname'
                      id='surname'
                      value={userInfo.surname || ''}
                      onChange={handleChange}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>

                <div className='sm:col-span-3'>
                  <label htmlFor='country' className='block text-sm font-medium leading-6 text-gray-900'>
                    Country
                  </label>
                  <div className='mt-2'>
                    <input
                      id='country'
                      name='country'
                      type='text'
                      value={userInfo.country || ''}
                      onChange={handleChange}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>

                <div className='sm:col-span-3'>
                  <label htmlFor='age' className='block text-sm font-medium leading-6 text-gray-900'>
                    Age
                  </label>
                  <div className='mt-2'>
                    <input
                      required
                      id='age'
                      name='age'
                      type='number'
                      value={userInfo.age || ''}
                      onChange={handleChange}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>
              </div>

              <h2 className='text-base font-semibold leading-8 mt-6 text-gray-900'>Gym stats</h2>
              <p className='mt-1 text-sm leading-6 text-gray-600'>This is where you can edit your all time best stats</p>
              <div className='mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-6'>
                <div className='sm:col-span-3'>
                  <label htmlFor='bench' className='block text-sm font-medium leading-6 text-gray-900'>
                    Bench
                  </label>
                  <div className='mt-2'>
                    <input
                      required
                      type='number'
                      name='bench'
                      id='bench'
                      value={userInfo.bench || ''}
                      onChange={handleChange}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>

                <div className='sm:col-span-3'>
                  <label htmlFor='squat' className='block text-sm font-medium leading-6 text-gray-900'>
                    Squat
                  </label>
                  <div className='mt-2'>
                    <input
                      required
                      type='number'
                      name='squat'
                      id='squat'
                      value={userInfo.squat || ''}
                      onChange={handleChange}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>

                <div className='sm:col-span-3'>
                  <label htmlFor='weight' className='block text-sm font-medium leading-6 text-gray-900'>
                    Weight
                  </label>
                  <div className='mt-2'>
                    <input
                      required
                      id='weight'
                      name='weight'
                      type='number'
                      value={userInfo.weight || ''}
                      onChange={handleChange}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>

                <div className='sm:col-span-3'>
                  <label htmlFor='deadlift' className='block text-sm font-medium leading-6 text-gray-900'>
                    Deadlift
                  </label>
                  <div className='mt-2'>
                    <input
                      required
                      id='deadlift'
                      name='deadlift'
                      type='number'
                      value={userInfo.deadlift || ''}
                      onChange={handleChange}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='border-b border-gray-900/10 pb-12'>
              <div className='border-b border-gray-900/10 pb-12'>
                <h2 className='text-base font-semibold leading-8 mt-6 text-gray-900'>Workouts</h2>
                {userInfo.workouts && (
                  <div className='mt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                    {Object.keys(userInfo.workouts).map((key) => (
                      <div key={key} className='p-4 border border-gray-300 rounded-lg bg-white'>
                        <div className='flex justify-between items-center mb-4'>
                          <h3 className='text-lg text-gray-900 mb-2 font-bold'>{userInfo.workouts[key].name}</h3>
                          <div className='flex gap-4'>
                            <Link to={`/workout/${key}`} className='flex items-center gap-x-2 text-indigo-600 hover:text-indigo-800'>
                              <PencilIcon className='h-5 w-5' />
                            </Link>
                            <button onClick={() => removeWorkout(key)} className='text-red-600 hover:text-red-800'>
                              <TrashIcon className='h-5 w-5' />
                            </button>
                          </div>
                        </div>
                        {Object.keys(userInfo.workouts[key].exercises).map((exercise) => (
                          <div key={exercise} className='mb-2 flex gap-2'>
                            <div className='font-medium'>{userInfo.workouts[key].exercises[exercise].name}:</div>
                            <div className='text-gray-700'>
                              {userInfo.workouts[key].exercises[exercise].sets.filter((rep) => rep !== 0).join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                <div className='flex justify-end mt-6'>
                  <Link
                    to='/workout/new'
                    className='rounded-md bg-indigo-600 px-5 py-2 text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  >
                    Add Workout
                  </Link>
                </div>
              </div>
            </div>

            <div className='mt-6 flex items-center justify-end gap-x-6'>
              <button
                type='submit'
                className='rounded-md bg-indigo-600 px-5 py-2 text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}
      {userData?.boughtMemberships && (
        <div className='border-t border-gray-300 mt-8'>
          <h2 className='text-base font-semibold leading-8 mt-6 text-gray-900'>Bought Memberships</h2>
          <div className='mt-4'>
            {userData.boughtMemberships.map((membership, index) => (
              <div key={index} className='border border-gray-300 rounded-md p-4 mb-4'>
                <p className='text-lg font-semibold'>{membership.offerName}</p>
                <p className='text-gray-600'>Start Date: {new Date(membership.startDate).toDateString()}</p>
                <p className='text-gray-600'>End Date: {new Date(membership.endDate).toDateString()}</p>
                <p className='text-gray-600'>Gym ID: {membership.gymId}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
