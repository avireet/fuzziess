import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [location, setLocation] = useState('');
    const [alternatePhone, setAlternatePhone] = useState('');
    const [hintName, setHintName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You must be logged in to view this page.');
                    return;
                }

                const res = await axios.get('http://localhost:2151/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(res.data);
                setName(res.data.name);
                setPhoneNumber(res.data.phoneNumber);
                setGender(res.data.gender || '');
                setDob(res.data.dob || '');
                setLocation(res.data.location || '');
                setAlternatePhone(res.data.alternatePhone || '');
                
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Could not fetch user profile. Please try again later.');
            }
        };

        fetchUserProfile();
    }, []);

    const handleSaveProfile = async () => {
        const token = localStorage.getItem('token');

        try {
            const updatedData = {
                name,
                phoneNumber,
                gender,
                dob,
                location,
                alternatePhone,
                hintName,
            };

            const res = await axios.patch('http://localhost:2151/api/auth/me', updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser({ ...user, ...updatedData });
            setIsEditing(false);
        } catch (err) {
            console.error('Error saving profile:', err);
            setError('Could not save profile. Please try again later.');
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        console.log(selectedFile);
    };

    const User = JSON.parse(localStorage.getItem("user")); // Retrieve user data
    const email = User ? User.email : null;

    const handleUpload = async () => {
        if (!selectedFile) {
            // handleError("Please select a file first!");
            alert('Please select a file first!')
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('email', email);
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }


        try {
            const response = await axios.post('http://localhost:2151/api/auth/setPhoto', formData);

            if (response.data.success) {
                console.log(response.data.profilePhotoUrl);
                setUser(response.data.updatedUser)
                // handleSuccess('profile photo updated');
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
            // handleError('Error uploading photo');
        }
    };


    const handleEdit = () => {
        setIsEditing(true);
    };

    if (error) {
        return <div className="profile-error-message">{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <main className='profile-main'>
        <div className="profile-container">
            <div className="profile-header">
                <div
                    className="profile-image"
                    style={{
                        backgroundImage: `url(${user.URL || 'https://via.placeholder.com/150'})`, 
                    }}
                ></div>
                <div className="profile-username">{user.name}</div> 
                 {/* Hidden file input */}
                 <div className='MulterPhoto'>
                 <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        id="file-upload"
                        style={{ display: 'none' }}
                    />
                    {/* Add Profile Picture Button */}
                    <label htmlFor="file-upload" className="profile-upload-button">
                        Add Profile Picture
                    </label>
                    {/* Upload button */}
                    <button onClick={handleUpload} className='upload-button-profile'>
                        Upload
                    </button>
                 </div>
                 
                
            </div>
            <div className="profile-details">
                <p><strong className='profile-details-fontFamily'>Full Name :</strong> {isEditing ? <input type="text" value={name} onChange={(e) => setName(e.target.value)} /> : user.name}</p>
                <p><strong className='profile-details-fontFamily'>Mobile Number :</strong> {isEditing ? <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /> : user.phoneNumber}</p>
                <p><strong className='profile-details-fontFamily'>Email ID :</strong> {user.email}</p>
                <p>
  <strong className="profile-details-fontFamily">Gender : </strong>
  {isEditing ? (
    <select value={gender} onChange={(e) => setGender(e.target.value)}>
      <option value="" disabled>
        Select Gender
      </option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="non-binary">Non-binary</option>
      <option value="prefer-not-to-say">Prefer not to say</option>
    </select>
  ) : (
    user.gender || '- not added -'
  )}
</p>
                <p><strong className='profile-details-fontFamily'>Date of Birth :</strong> {isEditing ? <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} /> : (user.dob || '- not added -')}</p>
                <p><strong className='profile-details-fontFamily'>Location :</strong> {isEditing ? <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} /> : (user.location || '- not added -')}</p>
                <p><strong className='profile-details-fontFamily'>Alternate Mobile :</strong> {isEditing ? <input type="text" value={alternatePhone} onChange={(e) => setAlternatePhone(e.target.value)} /> : (user.alternatePhone || '- not added -')}</p>
                

                {!isEditing ? (
                    <>
                        <div className="edit-button-profile" onClick={handleEdit}>EDIT</div>
                    </>
                ) : (
                    <>
                        <div className="profile-save-button" onClick={handleSaveProfile}>Save</div>
                        <div className="profile-cancel-button" onClick={() => setIsEditing(false)}>Cancel</div>
                    </>
                )}
            </div>
        </div>
        </main>
    );
};

export default ProfilePage;
