import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { AlertTriangle, Calendar, Clock, MapPin, Send, X, Camera, WifiOff, Phone, User, Navigation, Loader2, Globe, Shield, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const incidentTypes = [
  'Flooding',
  'Landslide',
  'Fire',
  'Road Accident',
  'Building Collapse',
  'Power Outage',
  'Medical Emergency',
  'Typhoon Damage',
  'Other',
];

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function ReportIncident() {
  const [formData, setFormData] = useState({
    incidentType: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    description: '',
    reporterPhone: '',
    reporterName: '',
  });
  const [position, setPosition] = useState([13.0547, 123.5214]); // Pio Duran coordinates
  const [submitted, setSubmitted] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [submitting, setSubmitting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(null);

  // Compress and resize image
  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve({
            data: compressedDataUrl,
            originalSize: file.size,
            compressedSize: Math.round((compressedDataUrl.length * 3) / 4),
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      if (file && file.type.startsWith('image/')) {
        const compressed = await compressImage(file);
        setUploadedImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            data: compressed.data,
            name: file.name,
            size: compressed.compressedSize,
            originalSize: compressed.originalSize,
          },
        ]);
      }
    }
    
    // Reset input
    e.target.value = '';
  };

  // Get current GPS location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    setLocationAccuracy(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        setPosition([lat, lng]);
        setLocationAccuracy(accuracy);
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to get your location. ';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        
        alert(errorMessage);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Listen for online/offline status changes
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const removeImage = (imageId) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const reportData = {
      id: crypto.randomUUID(),
      incidentType: formData.incidentType,
      date: formData.date,
      time: formData.time,
      description: formData.description,
      reporter_phone: formData.reporterPhone || undefined,
      reporter_name: formData.reporterName,
      location: {
        latitude: position[0],
        longitude: position[1],
      },
      images: uploadedImages,
      timestamp: new Date().toISOString(),
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Incident report submitted:', reportData);
      setSubmitted(true);
      
      setTimeout(() => {
        setSubmitted(false);
        resetForm();
      }, 3000);
    } catch (error) {
      console.error('Failed to submit incident report:', error);
      alert('Failed to submit incident report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      incidentType: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      description: '',
      reporterPhone: '',
      reporterName: '',
    });
    setUploadedImages([]);
    setPosition([13.0547, 123.5214]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" data-testid="report-incident-page">
      <Header title="REPORT AN INCIDENT" icon={AlertTriangle} showBack/>
      
      <main className="px-6 py-8 max-w-2xl mx-auto">
        {submitted && (
          <div className={`mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg animate-fadeIn`} data-testid="success-message">
            <CheckCircle className="w-6 h-6 animate-pulse" />
            <div>
              <p className="font-semibold text-lg">
                Report submitted successfully!
              </p>
              <p className="text-sm opacity-90">
                Thank you for helping keep our community safe
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="incident-form">
          {/* Incident Type */}
          <div className="animate-slide-up">
            <label className="block text-white font-semibold text-sm mb-3">
              INCIDENT TYPE
            </label>
            <select
              value={formData.incidentType}
              onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-600 rounded-2xl p-4 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
              required
              data-testid="incident-type-select"
            >
              <option value="" className="bg-slate-800">Select incident type</option>
              {incidentTypes.map((type) => (
                <option key={type} value={type} className="bg-slate-800">{type}</option>
              ))}
            </select>
          </div>

          {/* Reporter Name */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-white font-semibold text-sm mb-3">
              YOUR NAME
            </label>
            <div className="bg-slate-800/50 border border-slate-600 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-2 bg-blue-600/20 rounded-xl">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <input
                type="text"
                value={formData.reporterName}
                onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                placeholder="Enter your full name"
                className="flex-1 text-white bg-transparent focus:outline-none placeholder-slate-400"
                required
                data-testid="reporter-name-input"
              />
            </div>
          </div>

          {/* Reporter Phone */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-white font-semibold text-sm mb-3">
              PHONE NUMBER (Optional)
            </label>
            <div className="bg-slate-800/50 border border-slate-600 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-2 bg-green-600/20 rounded-xl">
                <Phone className="w-5 h-5 text-green-400" />
              </div>
              <input
                type="tel"
                value={formData.reporterPhone}
                onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                placeholder="e.g., 0917-000-0000"
                className="flex-1 text-white bg-transparent focus:outline-none placeholder-slate-400"
                data-testid="reporter-phone-input"
              />
            </div>
          </div>

          {/* Time of Incident */}
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <label className="block text-white font-semibold text-sm mb-3">
              TIME OF INCIDENT
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-600 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-2 bg-purple-600/20 rounded-xl">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="flex-1 text-white bg-transparent focus:outline-none"
                  data-testid="incident-date-input"
                />
              </div>
              <div className="bg-slate-800/50 border border-slate-600 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-2 bg-orange-600/20 rounded-xl">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="flex-1 text-white bg-transparent focus:outline-none"
                  data-testid="incident-time-input"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <label className="block text-white font-semibold text-sm mb-3">
              LOCATION
            </label>
            
            {/* GPS Button */}
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 rounded-2xl mb-3 hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
              data-testid="use-current-location-btn"
            >
              {gettingLocation ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Getting location...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5" />
                  <span>Use My Current Location</span>
                </>
              )}
            </button>

            {/* GPS Accuracy Indicator */}
            {locationAccuracy && (
              <div className="mb-3 bg-green-500/20 border border-green-500/30 rounded-2xl p-3 text-sm text-green-200 flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5" />
                <span>
                  GPS accuracy: ±{Math.round(locationAccuracy)}m
                  {locationAccuracy < 50 ? ' (High accuracy)' : locationAccuracy < 100 ? ' (Good)' : ' (Low accuracy)'}
                </span>
              </div>
            )}
            
            <div className="map-container h-64 mb-4 rounded-2xl overflow-hidden shadow-xl" data-testid="location-map">
              <MapContainer
                center={position}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                key={`${position[0]}-${position[1]}`}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
            <div className="bg-slate-800/50 border border-slate-600 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600/20 rounded-xl">
                  <MapPin className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-white text-sm font-mono">
                  {position[0].toFixed(4)}, {position[1].toFixed(4)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPosition([13.0547, 123.5214]);
                  setLocationAccuracy(null);
                }}
                className="text-yellow-400 text-sm font-medium hover:text-yellow-300 transition-colors"
                data-testid="reset-location-btn"
              >
                Reset
              </button>
            </div>
            <p className="text-slate-400 text-sm mt-3 text-center">
              Tap the map to manually adjust location or use GPS for automatic detection
            </p>
          </div>

          {/* Image Upload */}
          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <label className="block text-white font-semibold text-sm mb-3">
              UPLOAD IMAGES (Optional)
            </label>
            
            {/* Upload Button */}
            <label className="bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-slate-700/30 transition-all">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                data-testid="image-upload-input"
              />
              <div className="p-3 bg-blue-600/20 rounded-2xl mb-3">
                <Camera className="w-8 h-8 text-blue-400" />
              </div>
              <span className="text-white text-base font-medium mb-1">
                Tap to upload photos
              </span>
              <span className="text-slate-400 text-sm">
                Multiple images supported
              </span>
            </label>

            {/* Image Previews */}
            {uploadedImages.length > 0 && (
              <div className="mt-4 space-y-3">
                {uploadedImages.map((image) => (
                  <div
                    key={image.id}
                    className="bg-slate-800/50 border border-slate-600 rounded-2xl p-3 flex items-center gap-4"
                    data-testid="uploaded-image-preview"
                  >
                    {/* Thumbnail */}
                    <img
                      src={image.data}
                      alt={image.name}
                      className="w-20 h-20 object-cover rounded-xl shadow-md"
                    />
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {image.name}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        {(image.size / 1024).toFixed(1)} KB
                        {image.originalSize && image.originalSize > image.size && (
                          <span className="text-green-400 ml-2">
                            (↓{Math.round((1 - image.size / image.originalSize) * 100)}%)
                          </span>
                        )}
                      </p>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
                      data-testid="remove-image-btn"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                
                <div className="text-slate-400 text-sm text-center pt-2">
                  {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} uploaded
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <label className="block text-white font-semibold text-sm mb-3">
              DESCRIPTION
            </label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 500) })}
                placeholder="Please provide a detailed description of what happened..."
                className="w-full bg-slate-800/50 border border-slate-600 rounded-2xl p-4 text-white min-h-32 resize-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                maxLength={500}
                data-testid="description-textarea"
              />
              <span className="absolute bottom-3 right-4 text-slate-400 text-sm">
                {formData.description.length}/500
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-6 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-slate-700/50 border border-slate-600 text-white font-semibold py-4 rounded-2xl hover:bg-slate-600/50 transition-all"
              data-testid="cancel-btn"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-4 rounded-2xl hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
              data-testid="submit-report-btn"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  {isOffline && <WifiOff className="w-5 h-5" />}
                  <span>{isOffline ? 'Queue Report' : 'Submit Report'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}