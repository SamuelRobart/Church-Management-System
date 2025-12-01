'use client'
import React, { useState, useEffect } from 'react'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaEdit, FaTrash, FaPlus, FaTimes, FaUsers } from 'react-icons/fa'

const Event = () => {
  const [events, setEvents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    attendees: 0
  })
  const isAdmin = true

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      } else {
        setErrorMessage('Failed to fetch events')
      }
    } catch (error) {
      setErrorMessage('Error connecting to backend. Make sure Spring Boot server is running on port 8080.')
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(event => event.date === dateStr)
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    try {
      if (editingEventId) {
        // Update event
        const response = await fetch(`http://localhost:8080/api/events/${editingEventId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
        if (response.ok) {
          const updatedEvent = await response.json()
          setEvents(events.map(event =>
            event.id === editingEventId ? updatedEvent : event
          ))
        } else {
          setErrorMessage('Failed to update event')
          console.error('Error updating event:', response.statusText)
        }
      } else {
        // Create new event
        const response = await fetch('http://localhost:8080/api/events/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
        if (response.ok) {
          const newEvent = await response.json()
          setEvents([...events, newEvent])
        } else {
          setErrorMessage('Failed to create event')
          console.error('Error creating event:', response.statusText)
        }
      }
      
      setIsModalOpen(false)
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: '',
        attendees: 0
      })
      setEditingEventId(null)
    } catch (error) {
      setErrorMessage('Error saving event. Make sure backend is running.')
      console.error('Error saving event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (event) => {
    setFormData(event)
    setEditingEventId(event.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setLoading(true)
      setErrorMessage('')
      try {
        const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setEvents(events.filter(event => event.id !== eventId))
        } else {
          setErrorMessage('Failed to delete event')
          console.error('Error deleting event:', response.statusText)
        }
      } catch (error) {
        setErrorMessage('Error deleting event. Make sure backend is running.')
        console.error('Error deleting event:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCreateClick = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      capacity: '',
      attendees: 0
    })
    setEditingEventId(null)
    setIsModalOpen(true)
  }

  const upcomingEvents = events
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const calendarDays = generateCalendarDays()

  return (
    <div className='w-full h-auto p-3 bg-gray-50'>
      <div className='max-w-6xl mx-auto'>
        {/* Error Message Display */}
        {errorMessage && (
          <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center'>
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage('')}
              className='text-red-700 hover:text-red-900 font-bold'
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className='mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg'>
            <span>Loading...</span>
          </div>
        )}

        {/* Header with Create Button */}
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold text-gray-800'>Events</h1>
          {isAdmin && (
            <button
              onClick={handleCreateClick}
              disabled={loading}
              className='bg-persian-blue-600 hover:bg-persian-blue-700 disabled:bg-gray-400 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all text-sm'
            >
              <FaPlus /> Create Event
            </button>
          )}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          {/* Calendar Section */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow-md p-4'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold text-gray-800'>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <div className='flex gap-2'>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className='px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs'
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date())}
                    className='px-2 py-1 bg-persian-blue-600 hover:bg-persian-blue-700 text-white rounded text-xs'
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className='px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs'
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className='grid grid-cols-7 gap-1 mb-2'>
                {dayNames.map(day => (
                  <div key={day} className='text-center font-bold text-gray-600 py-1 text-xs'>
                    {day}
                  </div>
                ))}
              </div>

              <div className='grid grid-cols-7 gap-1'>
                {calendarDays.map((day, index) => {
                  const dayEvents = day ? getEventsForDate(day) : []
                  const isToday = day && new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString() === new Date().toDateString()

                  return (
                    <div
                      key={index}
                      className={`aspect-square p-1 rounded border transition-all ${
                        day
                          ? isToday
                            ? 'bg-persian-blue-600 border-persian-blue-600 text-white'
                            : dayEvents.length > 0
                            ? 'bg-red-50 border-red-300 hover:bg-red-100'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                          : 'bg-gray-100 border-gray-100'
                      } cursor-pointer text-center relative`}
                    >
                      {day && (
                        <>
                          <div className={`font-bold text-sm ${isToday ? 'text-white' : 'text-gray-800'}`}>
                            {day}
                          </div>
                          {dayEvents.length > 0 && (
                            <div className={`text-xs mt-1 ${isToday ? 'text-white' : 'text-red-600'}`}>
                              {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-md p-4 h-full'>
              <h2 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-2'>
                <FaCalendarAlt /> Upcoming Events
              </h2>

              <div className='space-y-3 max-h-[500px] overflow-y-auto'>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map(event => (
                    <div key={event.id} className='border-l-4 border-persian-blue-600 bg-blue-50 p-3 rounded hover:shadow-md transition-shadow'>
                      <h3 className='font-bold text-gray-800 text-xs mb-1.5'>{event.title}</h3>
                      
                      <div className='space-y-0.5 text-[10px] text-gray-600'>
                        <div className='flex items-center gap-2'>
                          <FaCalendarAlt className='text-persian-blue-600' />
                          <span>{event.date}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <FaClock className='text-persian-blue-600' />
                          <span>{event.time}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <FaMapMarkerAlt className='text-persian-blue-600' />
                          <span>{event.location}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <FaUsers className='text-persian-blue-600' />
                          <span>{event.attendees}/{event.capacity}</span>
                        </div>
                      </div>

                      {isAdmin && (
                        <div className='flex gap-2 mt-2'>
                          <button
                            onClick={() => handleEdit(event)}
                            className='flex-1 bg-persian-blue-600 hover:bg-persian-blue-700 text-white py-0.5 px-1.5 rounded text-[10px] flex items-center justify-center gap-1 transition-all'
                          >
                            <FaEdit size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className='flex-1 bg-red-600 hover:bg-red-700 text-white py-0.5 px-1.5 rounded text-[10px] flex items-center justify-center gap-1 transition-all'
                          >
                            <FaTrash size={12} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className='text-center text-gray-500 py-8'>
                    <p>No upcoming events</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* All Events List */}
        <div className='mt-4 bg-white rounded-lg shadow-md p-4'>
          <h2 className='text-xl font-bold text-gray-800 mb-3'>All Events</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
            {events.length > 0 ? (
              events.map(event => (
                <div key={event.id} className='border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow'>
                  <div className='mb-2'>
                    <h3 className='text-base font-bold text-gray-800'>{event.title}</h3>
                    <p className='text-xs text-gray-600'>{event.description}</p>
                  </div>

                  <div className='space-y-1 text-xs text-gray-700 mb-3'>
                    <div className='flex items-center gap-2'>
                      <FaCalendarAlt className='text-persian-blue-600' />
                      <span>{event.date}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <FaClock className='text-persian-blue-600' />
                      <span>{event.time}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <FaMapMarkerAlt className='text-persian-blue-600' />
                      <span>{event.location}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <FaUsers className='text-persian-blue-600' />
                      <span>{event.attendees}/{event.capacity} attendees</span>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleEdit(event)}
                        className='flex-1 bg-persian-blue-600 hover:bg-persian-blue-700 text-white py-1.5 rounded flex items-center justify-center gap-1 text-sm transition-all'
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className='flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded flex items-center justify-center gap-1 text-sm transition-all'
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className='col-span-full text-center text-gray-500 py-8'>
                <p>No events available</p>
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Event Modal */}
        {isModalOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4'>
            <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
              <div className='flex justify-between items-center p-6 border-b'>
                <h2 className='text-2xl font-bold text-gray-800'>
                  {editingEventId ? 'Edit Event' : 'Create Event'}
                </h2>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='text-gray-500 hover:text-gray-700'
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className='p-6 space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Event Title</label>
                  <input
                    type='text'
                    name='title'
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-persian-blue-600 outline-none text-gray-700'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
                  <textarea
                    name='description'
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows='3'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-persian-blue-600 outline-none text-gray-700'
                    required
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Date</label>
                    <input
                      type='date'
                      name='date'
                      value={formData.date || ''}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-persian-blue-600 outline-none text-gray-700'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Time</label>
                    <input
                      type='time'
                      name='time'
                      value={formData.time || ''}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-persian-blue-600 outline-none text-gray-700'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Location</label>
                  <input
                    type='text'
                    name='location'
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-persian-blue-600 outline-none text-gray-700'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Capacity</label>
                  <input
                    type='number'
                    name='capacity'
                    value={formData.capacity || ''}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-persian-blue-600 outline-none text-gray-700'
                    required
                  />
                </div>

                <div className='flex gap-4 mt-6'>
                  <button
                    type='submit'
                    className='flex-1 bg-persian-blue-600 text-white py-2 rounded-lg hover:bg-persian-blue-700 transition-all'
                  >
                    {editingEventId ? 'Save Changes' : 'Create Event'}
                  </button>
                  <button
                    type='button'
                    onClick={() => setIsModalOpen(false)}
                    className='flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Event