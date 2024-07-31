'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExampleCard from './ExampleCard';

// Define the type for your dance objects
interface Dance {
  _id: string;
  song_name: string;
  mp4_url: string;
  pkl_url: string;
  fbx_url: string;
  mp3_url: string;
  unique_id: string;
  task_id: string;
}

const AllDances: React.FC = () => {
  const [dances, setDances] = useState<Dance[]>([]);
  const [visibleFbx, setVisibleFbx] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<{ dances: Dance[] }>('https://bile.ngrok.app/all-dances');
        console.log(response.data);
        if (response.data && response.data.dances) {
          setDances(response.data.dances);
          setError(null); // Reset error if the request is successful
        } else {
          setDances([]); // Set to an empty array if response structure is not as expected
        }
      } catch (error) {
        console.error('Error fetching the dances:', error);
        setDances([]); // Set to an empty array in case of an error
        setError('Failed to fetch dances. Please try again later.');
      }
    })();
  }, []);

  const toggleFbxVisibility = (id: string) => {
    setVisibleFbx(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const filteredDances = dances.filter(
    (dance) =>
      dance.song_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dance.task_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDances.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredDances.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className='bg-custom-bg min-h-screen'>
      <input
        type="text"
        placeholder="Search by Task ID or Song Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300"
      />
      <div className="flex justify-center gap-2 mt-4 text-custom-pink">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <div className="flex flex-col gap-4 m-24">
        {currentItems.length > 0 ? (
          currentItems.map((dance) => (
            <div key={dance._id} className="bg-custom-blue text-custom-light-blue flex flex-col p-4">
             <div className="flex flex-row justify-between">
                <div className="flex flex-col"> 
                <h3>{dance.song_name}</h3>
                <p>Task ID: {dance.task_id}</p>
                </div>
                <button onClick={() => toggleFbxVisibility(dance._id)}>
                    {visibleFbx[dance._id] ? 'Hide dance' : 'Show dance'}
                </button>
             </div>
            <div className="flex items-center justify-center">
            <div className={`fbx-container ${visibleFbx[dance._id] ? 'visible' : 'hidden'}`}>
                <ExampleCard fbx_url={dance.fbx_url} mp3_url={dance.mp3_url} />
              </div>
            </div>
            </div>
          ))
        ) : (
          <p>No dances available.</p>
        )}
      </div>
    </div>
  );
};

export default AllDances;
