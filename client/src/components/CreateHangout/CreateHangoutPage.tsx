import { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { vibeOptions, categoryOptions } from '../../utils/mockData'
import "./CreateHangout.css"

// Fix leaflet default marker icon in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CreateHangoutPage = () => {
  /* ── form state ───────────────────────────────────────────── */
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<string>('indoor')
  const [description, setDescription] = useState('')
  const [maxPeople, setMaxPeople] = useState(6)
  const [selectedVibe, setSelectedVibe] = useState('')
  const [customVibe, setCustomVibe] = useState('')
  const [accessMode, setAccessMode] = useState<'public' | 'approval'>('public')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [locationSearch, setLocationSearch] = useState('')
  const [minAge, setMinAge] = useState('')
  const [message, setMessage] = useState('')

 

  /* ── refs for date/time inputs ────────────────────────────── */
  const dateInputRef = useRef<HTMLInputElement>(null)
  const timeInputRef = useRef<HTMLInputElement>(null)

  /* gradient tracks which side is active */
  const [gradientSide, setGradientSide] = useState<'left' | 'right'>('left')
  const [mapCenter] = useState<[number, number]>([12.9716, 77.5946])

  const focusLeft = () => setGradientSide('left')
  const focusRight = () => setGradientSide('right')

  /* format helpers */
  const formatDate = (d: string) => {
    if (!d) return 'date'
    const dt = new Date(d)
    return dt.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  const formatTime = (t: string) => {
    if (!t) return 'time'
    const [h, m] = t.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    return `${hour % 12 || 12}:${m} ${ampm}`
  }

  const handleSubmit = () => {
    console.log({
      title,category,description,maxPeople,selectedVibe,customVibe,accessMode,date,time,locationSearch,minAge,message
    })
  }

  /* clear all */
  const handleClear = () => {
    setTitle(''); setCategory('indoor'); setDescription('')
    setMaxPeople(6); setSelectedVibe(''); setCustomVibe('')
    setAccessMode('public'); setDate(''); setTime('')
    setLocationSearch(''); setMinAge(''); setMessage('')
  }

  /* open pickers programmatically */
  const openDatePicker = () => {
    const input = dateInputRef.current
    if (!input) return
    if (typeof input.showPicker === 'function') {
      input.showPicker()
    } else {
      input.click()
    }
  }

  const openTimePicker = () => {
    const input = timeInputRef.current
    if (!input) return
    if (typeof input.showPicker === 'function') {
      input.showPicker()
    } else {
      input.click()
    }
  }

  /* ── render ────────────────────────────────────────────────── */
  return (
    <section className='create-hangout-section'>
      <div className="container">
        <div className={`parent-container ${gradientSide === 'left' ? 'gradient-right' : ''}`}>

          {/* ═══════════ LEFT SIDE ═══════════ */}
          <div className="form-left" onFocus={focusLeft} onClick={focusLeft}>

            {/* title + category */}
            <div className="form-row title-row">
              <input
                type="text"
                placeholder='title'
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="input-field input-title"
              />
              <div className="select-wrapper">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="input-field input-category"
                >
                  {categoryOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <span className="select-arrow">↓</span>
              </div>
            </div>

            {/* description */}
            <div className="form-row">
              <textarea
                placeholder='description'
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="input-field input-description"
              />
              {/* Enhance with AI button */}
            </div>

            {/* max people counter */}
            <div className="form-row" id='form-max-people'>
              <div className="max-people">
                <button
                  className='counter-btn'
                  onClick={() => setMaxPeople(Math.max(2, maxPeople - 1))}
                >−</button>
                <span className='counter-value'>{maxPeople} people</span>
                <button
                  className='counter-btn'
                  onClick={() => setMaxPeople(Math.min(50, maxPeople + 1))}
                >+</button>
              </div>
            </div>

            {/* vibe chips */}
            <div className="form-row">
              <div className="vibe-chips">
                {vibeOptions.map(v => (
                  <button
                    key={v}
                    className={`vibe-chip ${selectedVibe === v ? 'active' : ''}`}
                    onClick={() => setSelectedVibe(selectedVibe === v ? '' : v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* custom vibe + toggle */}
            <div className="form-row bottom-row">
              <input
                type="text"
                placeholder='custom vibe ?'
                value={customVibe}
                onChange={e => setCustomVibe(e.target.value)}
                className="input-field input-custom-vibe"
              />

              <div className={`toggle ${accessMode}`}>
                <div className="toggle-slider" />
                <span
                  className={accessMode === 'public' ? 'active' : ''}
                  onClick={() => setAccessMode('public')}
                >public</span>
                <span
                  className={accessMode === 'approval' ? 'active' : ''}
                  onClick={() => setAccessMode('approval')}
                >approval</span>
              </div>
            </div>
          </div>


          {/* ═══════════ RIGHT SIDE ═══════════ */}
          <div className="form-right" onFocus={focusRight} onClick={focusRight}>

            {/* date + time */}
            <div className="form-row-right datetime-row">

              {/* DATE BLOCK */}
              <div className="datetime-block" onClick={openDatePicker}>
                <div className="datetime-icon">
                  {/* Calendar icon */}
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <rect x="8" y="14" width="40" height="34" rx="5" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <line x1="8" y1="24" x2="48" y2="24" stroke="currentColor" strokeWidth="2"/>
                    <line x1="20" y1="8" x2="20" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="36" y1="8" x2="36" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <rect x="16" y="30" width="6" height="4" rx="1" fill="currentColor" opacity="0.3"/>
                    <rect x="25" y="30" width="6" height="4" rx="1" fill="currentColor" opacity="0.3"/>
                    <rect x="34" y="30" width="6" height="4" rx="1" fill="currentColor" opacity="0.3"/>
                    <rect x="16" y="38" width="6" height="4" rx="1" fill="currentColor" opacity="0.3"/>
                    <rect x="25" y="38" width="6" height="4" rx="1" fill="currentColor" opacity="0.3"/>
                  </svg>
                </div>
                <input
                  ref={dateInputRef}
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="datetime-input-hidden"
                  onClick={e => e.stopPropagation()}
                />
                <p className="datetime-label">{formatDate(date)}</p>
              </div>

              {/* TIME BLOCK */}
              <div className="datetime-block" onClick={openTimePicker}>
                <div className="datetime-icon">
                  {/* Clock icon */}
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <line x1="28" y1="28" x2="28" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="28" y1="28" x2="38" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="28" cy="28" r="2.5" fill="currentColor"/>
                    {/* hour marks */}
                    <circle cx="28" cy="9" r="1.5" fill="currentColor" opacity="0.4"/>
                    <circle cx="47" cy="28" r="1.5" fill="currentColor" opacity="0.4"/>
                    <circle cx="28" cy="47" r="1.5" fill="currentColor" opacity="0.4"/>
                    <circle cx="9" cy="28" r="1.5" fill="currentColor" opacity="0.4"/>
                  </svg>
                </div>
                <input
                  ref={timeInputRef}
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="datetime-input-hidden"
                  onClick={e => e.stopPropagation()}
                />
                <p className="datetime-label">{formatTime(time)}</p>
              </div>

            </div>

            {/* search location + map */}
            <div className="form-row-right">
              <div className="map-location">
                <div className="search-location-wrapper">
                  <input
                    type="search"
                    placeholder='search location'
                    value={locationSearch}
                    onChange={e => setLocationSearch(e.target.value)}
                    className="input-field input-location-search"
                  />
                  <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="map-block">
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="leaflet-map"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker position={mapCenter} />
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* min age + message */}
            <div className="form-row-right bottom-inputs">
              <input
                type="number"
                placeholder='min. Age'
                value={minAge}
                onChange={e => setMinAge(e.target.value)}
                className="input-field input-min-age"
              />
              <input
                type="text"
                placeholder='Any message'
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="input-field input-message"
              />
            </div>
          </div>

        </div>

        {/* ═══════════ SUBMIT BUTTONS ═══════════ */}
        <div className='form-submit-btns'>
          <button className='btn-clear' onClick={handleClear}>clear all</button>
          <button className='btn-create' onClick={handleSubmit}>create</button>
        </div>
      </div>
    </section>
  )
}

export default CreateHangoutPage