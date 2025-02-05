import React, { useState } from 'react';
import './App.css'; // Import the custom CSS

const App = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const [imageURL, setImageURL] = useState(null); // New state for image URL

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setError(null); // Reset error

        // Create an object URL for the uploaded image
        if (file) {
            setImageURL(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch('https://eye-disease-classification-production.up.railway.app/predict', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setPrediction(result.prediction);
            } else {
                const err = await response.json();
                setError(err.error);
            }
        } catch (err) {
            setError('Error communicating with the server.');
        }
    };

    return (
        <div className="container">
            <h1 className="title">Eye Disease Prediction</h1>
            <form onSubmit={handleSubmit} className="form">
                <label className="label">
                    Upload an Image
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        required 
                        className="file-input"
                    />
                </label>
                <button type="submit" className="submit-button">Predict</button>
            </form>

            {/* Display the uploaded image */}
            {imageURL && (
                <div className="image-preview">
                    <h2>Uploaded Image:</h2>
                    <img src={imageURL} alt="Uploaded" className="preview-image" />
                </div>
            )}

            {prediction && (
                <div className="result success">
                    <h2>Prediction:</h2>
                    <p>{prediction}</p>
                </div>
            )}

            {error && (
                <div className="result error">
                    <h2>Error:</h2>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default App;
