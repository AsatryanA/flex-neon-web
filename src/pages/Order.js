import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import './Order.css';

function Order() {
  const [formData, setFormData] = useState({
    text: '',
    font: 'modern',
    color: 'blue',
    size: 'medium',
    backing: 'clear',
    mounting: 'wall',
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [customFont, setCustomFont] = useState(null);
  const [bgImage, setBgImage] = useState(null);
  const [signPos, setSignPos] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isStretching, setIsStretching] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [previewScale, setPreviewScale] = useState(48);
  const [rotation, setRotation] = useState(0);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);
  const [scaleX, setScaleX] = useState(100);
  const [scaleY, setScaleY] = useState(100);
  const resizeStart = useRef(null);
  const rotateStart = useRef(null);
  const stretchStart = useRef(null);
  const bboxRef = useRef(null);
  const textRef = useRef(null);
  const fileInputRef = useRef(null);
  const bgInputRef = useRef(null);
  const previewRef = useRef(null);

  // Undo/Redo history
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const isUndoRedoRef = useRef(false);
  const [historyVersion, setHistoryVersion] = useState(0);

  const getDesignState = useCallback(() => ({
    text: formData.text,
    font: formData.font,
    color: formData.color,
    previewScale,
    rotation,
    skewX,
    skewY,
    scaleX,
    scaleY,
    signPos: { ...signPos },
  }), [formData.text, formData.font, formData.color, previewScale, rotation, skewX, skewY, scaleX, scaleY, signPos]);

  // Initialize history with the first state
  useEffect(() => {
    if (historyRef.current.length === 0) {
      historyRef.current.push(getDesignState());
      historyIndexRef.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushHistory = useCallback(() => {
    if (isUndoRedoRef.current) return;
    const state = getDesignState();
    const idx = historyIndexRef.current;
    // Trim any future states
    historyRef.current = historyRef.current.slice(0, idx + 1);
    historyRef.current.push(state);
    // Keep max 50 states
    if (historyRef.current.length > 50) {
      historyRef.current = historyRef.current.slice(-50);
    }
    historyIndexRef.current = historyRef.current.length - 1;
    setHistoryVersion(v => v + 1);
  }, [getDesignState]);

  const applyState = useCallback((state) => {
    isUndoRedoRef.current = true;
    setFormData(prev => ({ ...prev, text: state.text, font: state.font, color: state.color }));
    setPreviewScale(state.previewScale);
    setRotation(state.rotation);
    setSkewX(state.skewX);
    setSkewY(state.skewY);
    setScaleX(state.scaleX);
    setScaleY(state.scaleY);
    setSignPos(state.signPos);
    setHistoryVersion(v => v + 1);
    setTimeout(() => { isUndoRedoRef.current = false; }, 0);
  }, []);

  const handleUndo = useCallback(() => {
    const idx = historyIndexRef.current;
    if (idx <= 0) return;
    if (idx === historyRef.current.length - 1) {
      historyRef.current[idx] = getDesignState();
    }
    historyIndexRef.current = idx - 1;
    applyState(historyRef.current[idx - 1]);
  }, [getDesignState, applyState]);

  const handleRedo = useCallback(() => {
    const idx = historyIndexRef.current;
    if (idx >= historyRef.current.length - 1) return;
    historyIndexRef.current = idx + 1;
    applyState(historyRef.current[idx + 1]);
  }, [applyState]);

  // These must be computed fresh each render (historyVersion forces re-render)
  void historyVersion;
  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  const autoResizeText = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'text') {
      setTimeout(autoResizeText, 0);
    }
    if (['text', 'font', 'color'].includes(name)) {
      setTimeout(() => pushHistory(), 0);
    }
  };

  const handleFontUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name;
    const fontName = fileName.replace(/\.[^/.]+$/, '');

    const reader = new FileReader();
    reader.onload = (event) => {
      const fontData = event.target.result;
      const face = new FontFace('CustomUploaded', fontData);
      face.load().then((loadedFace) => {
        document.fonts.add(loadedFace);
        setCustomFont({ label: fontName, family: "'CustomUploaded'", weight: 400 });
        setFormData((prev) => ({ ...prev, font: 'custom' }));
      }).catch(() => {
        alert('Could not load font file. Please try a different .ttf, .otf, .woff, or .woff2 file.');
      });
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const removeCustomFont = useCallback(() => {
    setCustomFont(null);
    if (formData.font === 'custom') {
      setFormData((prev) => ({ ...prev, font: 'modern' }));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [formData.font]);

  const handleBgUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBgImage(url);
    setSignPos({ x: 50, y: 50 });
  }, []);

  const removeBgImage = useCallback(() => {
    if (bgImage) URL.revokeObjectURL(bgImage);
    setBgImage(null);
    if (bgInputRef.current) bgInputRef.current.value = '';
  }, [bgImage]);

  const getPointerPos = useCallback((e, rect) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  }, []);

  const handleDragStart = useCallback((e) => {
    if (!bgImage || isResizing || isRotating || isStretching) return;
    e.preventDefault();
    setIsDragging(true);
  }, [bgImage, isResizing, isRotating, isStretching]);

  const handleResizeStart = useCallback((e, ySign) => {
    e.preventDefault();
    e.stopPropagation();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    resizeStart.current = { y: clientY, scale: previewScale, ySign };
    setIsResizing(true);
  }, [previewScale]);

  const handleRotateStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!bboxRef.current) return;
    const rect = bboxRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const initialAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    rotateStart.current = { initialAngle, startRotation: rotation };
    setIsRotating(true);
  }, [rotation]);

  const handleStretchStart = useCallback((e, axis, sign) => {
    e.preventDefault();
    e.stopPropagation();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    stretchStart.current = { x: clientX, y: clientY, axis, sign, startScaleX: scaleX, startScaleY: scaleY };
    setIsStretching(true);
  }, [scaleX, scaleY]);

  const handlePointerMove = useCallback((e) => {
    if (isRotating && rotateStart.current && bboxRef.current) {
      e.preventDefault();
      const rect = bboxRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
      let newRotation = rotateStart.current.startRotation + (currentAngle - rotateStart.current.initialAngle);
      // Snap to cardinal angles
      [0, 90, -90, 180, -180].forEach(snap => {
        if (Math.abs(newRotation - snap) < 3) newRotation = snap;
      });
      setRotation(Math.round(newRotation));
      return;
    }
    if (isStretching && stretchStart.current) {
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const s = stretchStart.current.sign;
      if (stretchStart.current.axis === 'x') {
        const delta = (clientX - stretchStart.current.x) * s;
        setScaleX(Math.round(Math.max(30, Math.min(200, stretchStart.current.startScaleX + delta * 0.5))));
      } else {
        const delta = (clientY - stretchStart.current.y) * s;
        setScaleY(Math.round(Math.max(30, Math.min(200, stretchStart.current.startScaleY + delta * 0.5))));
      }
      return;
    }
    if (isResizing && resizeStart.current) {
      e.preventDefault();
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const delta = (clientY - resizeStart.current.y) * resizeStart.current.ySign;
      const newScale = Math.max(16, Math.min(120, resizeStart.current.scale + delta * 0.5));
      setPreviewScale(Math.round(newScale));
      return;
    }
    if (isDragging && previewRef.current) {
      e.preventDefault();
      const rect = previewRef.current.getBoundingClientRect();
      setSignPos(getPointerPos(e, rect));
    }
  }, [isRotating, isStretching, isResizing, isDragging, getPointerPos]);

  const handlePointerEnd = useCallback(() => {
    if (isDragging || isResizing || isRotating || isStretching) {
      setTimeout(() => pushHistory(), 0);
    }
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
    setIsStretching(false);
    resizeStart.current = null;
    rotateStart.current = null;
    stretchStart.current = null;
  }, [isDragging, isResizing, isRotating, isStretching, pushHistory]);

  const resetTransforms = useCallback(() => {
    setRotation(0);
    setSkewX(0);
    setSkewY(0);
    setScaleX(100);
    setScaleY(100);
    setTimeout(() => pushHistory(), 0);
  }, [pushHistory]);

  const colors = [
    { value: 'white', label: 'White', color: 'var(--neon-white)' },
    { value: 'warmwhite', label: 'Warm White', color: 'var(--neon-warmwhite)' },
    { value: 'blue', label: 'Ice Blue', color: 'var(--neon-blue)' },
    { value: 'darkblue', label: 'Blue', color: 'var(--neon-darkblue)' },
    { value: 'pink', label: 'Pink', color: 'var(--neon-pink)' },
    { value: 'red', label: 'Red', color: 'var(--neon-red)' },
    { value: 'green', label: 'Green', color: 'var(--neon-green)' },
    { value: 'orange', label: 'Orange', color: 'var(--neon-orange)' }
  ];

  const fonts = [
    { value: 'modern', label: 'Modern', family: "'Orbitron', sans-serif", weight: 700 },
    { value: 'bold', label: 'Bold', family: "'Poppins', sans-serif", weight: 700 },
    { value: 'vintage', label: 'Vintage', family: "'Playfair Display', serif", weight: 700 },
    { value: 'dancing', label: 'Dancing Script', family: "'Dancing Script', cursive", weight: 700 },
    { value: 'greatvibes', label: 'Great Vibes', family: "'Great Vibes', cursive", weight: 400 },
    { value: 'pacifico', label: 'Pacifico', family: "'Pacifico', cursive", weight: 400 },
    { value: 'caveat', label: 'Caveat', family: "'Caveat', cursive", weight: 700 },
    { value: 'sacramento', label: 'Sacramento', family: "'Sacramento', cursive", weight: 400 },
    { value: 'satisfy', label: 'Satisfy', family: "'Satisfy', cursive", weight: 400 },
  ];

  const sizes = [
    { value: 'small', label: 'Small', dimensions: '12" x 8"', price: 89 },
    { value: 'medium', label: 'Medium', dimensions: '24" x 16"', price: 159 },
    { value: 'large', label: 'Large', dimensions: '36" x 24"', price: 249 },
    { value: 'xlarge', label: 'X-Large', dimensions: '48" x 32"', price: 359 }
  ];

  const backingPrices = {
    clear: 0,
    black: 10,
    white: 10,
    wood: 25
  };

  const mountingPrices = {
    wall: 0,
    hanging: 15,
    standing: 25
  };

  const selectedFont = formData.font === 'custom' && customFont
    ? customFont
    : fonts.find(f => f.value === formData.font) || fonts[0];
  const selectedColor = colors.find(c => c.value === formData.color) || colors[0];
  const selectedSize = sizes.find(s => s.value === formData.size) || sizes[1];

  const totalPrice = useMemo(() => {
    const base = selectedSize.price;
    const backing = backingPrices[formData.backing] || 0;
    const mounting = mountingPrices[formData.mounting] || 0;
    return base + backing + mounting;
  }, [formData.size, formData.backing, formData.mounting, selectedSize.price]);

  const previewStyle = {
    color: selectedColor.color,
    fontFamily: selectedFont.family,
    fontWeight: selectedFont.weight,
  };

  const textTransform = `rotate(${rotation}deg) skewX(${skewX}deg) skewY(${skewY}deg) scaleX(${scaleX / 100}) scaleY(${scaleY / 100})`;

  const buildEmailBody = () => {
    const backingLabels = { clear: 'Clear Acrylic', black: 'Black Acrylic', white: 'White Acrylic', wood: 'Wood' };
    const mountingLabels = { wall: 'Wall Mount', hanging: 'Hanging Chain', standing: 'Standing Base' };

    const lines = [
      `--- FLEX NEON - ORDER REQUEST ---`,
      ``,
      `DESIGN DETAILS:`,
      `  Text: ${formData.text}`,
      `  Font: ${selectedFont.label}${formData.font === 'custom' ? ' (custom uploaded)' : ''}`,
      `  Color: ${selectedColor.label}`,
      `  Size: ${selectedSize.label} (${selectedSize.dimensions})`,
      `  Backing: ${backingLabels[formData.backing]}`,
      `  Mounting: ${mountingLabels[formData.mounting]}`,
      ``,
      `PRICE BREAKDOWN:`,
      `  Base price (${selectedSize.label}): $${selectedSize.price}`,
      backingPrices[formData.backing] > 0 ? `  Backing (${backingLabels[formData.backing]}): +$${backingPrices[formData.backing]}` : null,
      mountingPrices[formData.mounting] > 0 ? `  Mounting (${mountingLabels[formData.mounting]}): +$${mountingPrices[formData.mounting]}` : null,
      `  TOTAL: $${totalPrice}`,
      ``,
      `CUSTOMER DETAILS:`,
      `  Name: ${formData.name}`,
      `  Email: ${formData.email}`,
      `  Phone: ${formData.phone}`,
      `  Address: ${formData.address}`,
      formData.notes ? `  Notes: ${formData.notes}` : null,
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Neon Sign Order - "${formData.text}"`);
    const body = encodeURIComponent(buildEmailBody());
    window.location.href = `mailto:hello@flexneon.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (submitted) {
    return (
      <div className="order">
        <div className="order-container">
          <div className="success-page">
            <div className="success-icon-large">&#10003;</div>
            <h1 className="success-title neon-text" style={{ color: 'var(--neon-pink)' }}>
              Email Sent!
            </h1>
            <p className="success-text">
              Your order details have been sent via email. We'll review your request and get back to you within 24-48 hours with a digital proof.
            </p>
            <div className="success-details">
              <h3>Order Summary</h3>
              <div className="order-preview">
                <div className="preview-sign neon-text" style={previewStyle}>
                  {formData.text || 'Your Text Here'}
                </div>
                <div className="order-specs">
                  <p><strong>Size:</strong> {selectedSize.label} ({selectedSize.dimensions})</p>
                  <p><strong>Color:</strong> {selectedColor.label}</p>
                  <p><strong>Font:</strong> {selectedFont.label}</p>
                  <p><strong>Total Price:</strong> <span className="price-highlight">${totalPrice}</span></p>
                </div>
              </div>
            </div>
            <button className="neon-button" onClick={() => window.location.href = '/'}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order">
      <div className="order-container">
        {/* Compact header with inline stepper */}
        <div className="order-topbar">
          <span className="order-topbar-title neon-text" style={{ color: 'var(--neon-pink)' }}>Design Your Sign</span>
          <div className="mini-stepper">
            {['Design', 'Options', 'Details'].map((label, i) => (
              <span key={i} className={`mini-step ${step >= i + 1 ? 'active' : ''}`}>
                <span className="mini-dot"></span>
                <span className="mini-label">{label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Order Form */}
        <form className="order-form" onSubmit={handleSendEmail}>
          {/* Step 1: Design */}
          {step === 1 && (
            <div className="form-step">
              {/* Text input — compact, right above preview */}
              <div className="text-input-inline">
                <textarea
                  ref={textRef}
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  required
                  placeholder="Type your neon text..."
                  maxLength="100"
                  rows="1"
                  className="text-input-auto"
                ></textarea>
                <span className="char-count-inline">{formData.text.length}/100</span>
              </div>

              <input
                ref={bgInputRef}
                type="file"
                accept="image/*"
                onChange={handleBgUpload}
                className="font-upload-input"
              />
              {/* Live Preview */}
              <div
                ref={previewRef}
                className={`design-preview ${bgImage ? 'has-bg' : ''} ${isDragging ? 'dragging' : ''}`}
                style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerEnd}
                onMouseLeave={handlePointerEnd}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerEnd}
                onClick={(e) => {
                  if (e.target === e.currentTarget || e.target.classList.contains('remove-bg-btn')) {
                    setIsSelected(false);
                  }
                }}
              >
                {bgImage ? (
                  <button
                    type="button"
                    className="remove-bg-btn"
                    onClick={(e) => { e.stopPropagation(); removeBgImage(); }}
                    title="Remove background"
                  >
                    &times;
                  </button>
                ) : (
                  <button
                    type="button"
                    className="add-bg-btn"
                    onClick={(e) => { e.stopPropagation(); bgInputRef.current?.click(); }}
                    title="Upload your photo"
                  >
                    <span className="add-bg-icon">+</span>
                    <span className="add-bg-text">Add Photo</span>
                  </button>
                )}
                <div
                  ref={bboxRef}
                  className={`sign-bbox ${isSelected ? 'selected' : ''}`}
                  style={bgImage ? {
                    position: 'absolute',
                    left: `${signPos.x}%`,
                    top: `${signPos.y}%`,
                    transform: `translate(-50%, -50%) ${textTransform}`,
                  } : { transform: textTransform }}
                  onClick={(e) => { e.stopPropagation(); setIsSelected(true); }}
                >
                  <div
                    className="preview-sign neon-text"
                    style={{
                      ...previewStyle,
                      fontSize: `${previewScale}px`,
                      whiteSpace: 'pre',
                      cursor: bgImage ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
                    }}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                  >
                    {formData.text || 'Your Text Here'}
                  </div>
                  {isSelected && (
                    <>
                      {/* Corner resize handles: top = drag up to grow (-1), bottom = drag down to grow (1) */}
                      <div className="resize-handle resize-tl" onMouseDown={(e) => handleResizeStart(e, -1)} onTouchStart={(e) => handleResizeStart(e, -1)}></div>
                      <div className="resize-handle resize-tr" onMouseDown={(e) => handleResizeStart(e, -1)} onTouchStart={(e) => handleResizeStart(e, -1)}></div>
                      <div className="resize-handle resize-bl" onMouseDown={(e) => handleResizeStart(e, 1)} onTouchStart={(e) => handleResizeStart(e, 1)}></div>
                      <div className="resize-handle resize-br" onMouseDown={(e) => handleResizeStart(e, 1)} onTouchStart={(e) => handleResizeStart(e, 1)}></div>
                      {/* Edge stretch handles: left/top drag outward (-1), right/bottom drag outward (1) */}
                      <div className="stretch-handle stretch-l" onMouseDown={(e) => handleStretchStart(e, 'x', -1)} onTouchStart={(e) => handleStretchStart(e, 'x', -1)}></div>
                      <div className="stretch-handle stretch-r" onMouseDown={(e) => handleStretchStart(e, 'x', 1)} onTouchStart={(e) => handleStretchStart(e, 'x', 1)}></div>
                      <div className="stretch-handle stretch-t" onMouseDown={(e) => handleStretchStart(e, 'y', -1)} onTouchStart={(e) => handleStretchStart(e, 'y', -1)}></div>
                      <div className="stretch-handle stretch-b" onMouseDown={(e) => handleStretchStart(e, 'y', 1)} onTouchStart={(e) => handleStretchStart(e, 'y', 1)}></div>
                      {/* Rotation handle with stem */}
                      <div className="rotate-stem"></div>
                      <div className="rotate-handle" onMouseDown={handleRotateStart} onTouchStart={handleRotateStart}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                      </div>
                    </>
                  )}
                </div>
                {/* Floating toolbar — appears when selected */}
                {isSelected && (
                  <div className="floating-toolbar" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className={`ft-btn ${!canUndo ? 'ft-disabled' : ''}`} onClick={handleUndo} title="Undo">&#8630;</button>
                    <button type="button" className={`ft-btn ${!canRedo ? 'ft-disabled' : ''}`} onClick={handleRedo} title="Redo">&#8631;</button>
                    <span className="ft-sep"></span>
                    <span className="ft-group">
                      <button type="button" className="ft-btn ft-sm" onClick={() => { setSkewX(s => Math.max(-45, s - 5)); setTimeout(() => pushHistory(), 0); }} title="Skew left">&#9664;</button>
                      <span className="ft-tag">Skew</span>
                      <button type="button" className="ft-btn ft-sm" onClick={() => { setSkewX(s => Math.min(45, s + 5)); setTimeout(() => pushHistory(), 0); }} title="Skew right">&#9654;</button>
                    </span>
                    <span className="ft-sep"></span>
                    <button type="button" className="ft-btn ft-reset" onClick={resetTransforms} title="Reset all transforms">Reset</button>
                  </div>
                )}
                {!isSelected && !isDragging && !isResizing && (
                  <span className="drag-hint">Click on the text to select it</span>
                )}
              </div>
              {/* Color dots — right under the preview */}
              <div className="color-strip">
                {colors.map(color => (
                  <div
                    key={color.value}
                    className={`color-dot ${formData.color === color.value ? 'selected' : ''}`}
                    onClick={() => { setFormData({ ...formData, color: color.value }); setTimeout(() => pushHistory(), 0); }}
                    title={color.label}
                  >
                    <div className="color-dot-inner" style={{ backgroundColor: color.color, boxShadow: `0 0 10px ${color.color}` }}></div>
                  </div>
                ))}
              </div>

              {/* Font — compact grid with upload merged in */}
              <div className="form-group compact-group">
                <label>Font</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={handleFontUpload}
                  className="font-upload-input"
                />
                <div className="font-grid-compact">
                  {fonts.map(font => (
                    <div
                      key={font.value}
                      className={`font-chip ${formData.font === font.value ? 'selected' : ''}`}
                      onClick={() => { setFormData({ ...formData, font: font.value }); setTimeout(() => pushHistory(), 0); }}
                    >
                      <span
                        className="font-chip-preview"
                        style={{ fontFamily: font.family, fontWeight: font.weight }}
                      >
                        Aa
                      </span>
                      <span className="font-chip-name">{font.label}</span>
                    </div>
                  ))}
                  {customFont && (
                    <div
                      className={`font-chip font-chip-custom ${formData.font === 'custom' ? 'selected' : ''}`}
                      onClick={() => { setFormData({ ...formData, font: 'custom' }); setTimeout(() => pushHistory(), 0); }}
                    >
                      <span
                        className="font-chip-preview"
                        style={{ fontFamily: customFont.family, fontWeight: customFont.weight }}
                      >
                        Aa
                      </span>
                      <span className="font-chip-name">{customFont.label}</span>
                      <button
                        type="button"
                        className="remove-custom-font"
                        onClick={(e) => { e.stopPropagation(); removeCustomFont(); }}
                        title="Remove custom font"
                      >
                        &times;
                      </button>
                    </div>
                  )}
                  {/* Upload font card */}
                  <div
                    className="font-chip font-chip-upload"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="font-chip-plus">+</span>
                    <span className="font-chip-name">Upload</span>
                  </div>
                </div>
              </div>

              <button type="button" className="neon-button next-btn" onClick={nextStep}>
                Next Step &rarr;
              </button>
            </div>
          )}

          {/* Step 2: Options */}
          {step === 2 && (
            <div className="form-step">

              {/* Size — compact row */}
              <div className="form-group compact-group">
                <label>Size</label>
                <div className="size-row">
                  {sizes.map(size => (
                    <div
                      key={size.value}
                      className={`size-chip ${formData.size === size.value ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, size: size.value })}
                    >
                      <span className="size-chip-name">{size.label}</span>
                      <span className="size-chip-dim">{size.dimensions}</span>
                      <span className="size-chip-price">${size.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backing + Mounting side by side */}
              <div className="form-row">
                <div className="form-group compact-group">
                  <label htmlFor="backing">Backing</label>
                  <select
                    id="backing"
                    name="backing"
                    value={formData.backing}
                    onChange={handleChange}
                    required
                    className="select-sm"
                  >
                    <option value="clear">Clear Acrylic</option>
                    <option value="black">Black (+$10)</option>
                    <option value="white">White (+$10)</option>
                    <option value="wood">Wood (+$25)</option>
                  </select>
                </div>
                <div className="form-group compact-group">
                  <label htmlFor="mounting">Mounting</label>
                  <select
                    id="mounting"
                    name="mounting"
                    value={formData.mounting}
                    onChange={handleChange}
                    required
                    className="select-sm"
                  >
                    <option value="wall">Wall Mount</option>
                    <option value="hanging">Hanging (+$15)</option>
                    <option value="standing">Standing (+$25)</option>
                  </select>
                </div>
              </div>

              {/* Price — slim inline bar */}
              <div className="price-bar">
                <div className="price-bar-items">
                  <span className="price-bar-item">{selectedSize.label} ${selectedSize.price}</span>
                  {backingPrices[formData.backing] > 0 && (
                    <span className="price-bar-item">+${backingPrices[formData.backing]}</span>
                  )}
                  {mountingPrices[formData.mounting] > 0 && (
                    <span className="price-bar-item">+${mountingPrices[formData.mounting]}</span>
                  )}
                </div>
                <span className="price-bar-total">${totalPrice}</span>
              </div>

              <div className="button-group">
                <button type="button" className="back-btn" onClick={prevStep}>
                  &larr; Back
                </button>
                <button type="button" className="neon-button next-btn" onClick={nextStep}>
                  Next Step &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Details */}
          {step === 3 && (
            <div className="form-step">

              {/* Order Review */}
              <div className="order-review">
                <div className="review-preview">
                  <div className="preview-sign neon-text" style={previewStyle}>
                    {formData.text || 'Your Text Here'}
                  </div>
                </div>
                <div className="review-details">
                  <p><strong>Font:</strong> {selectedFont.label}</p>
                  <p><strong>Color:</strong> {selectedColor.label}</p>
                  <p><strong>Size:</strong> {selectedSize.label} ({selectedSize.dimensions})</p>
                  <p className="review-price"><strong>Total: <span className="price-highlight">${totalPrice}</span></strong></p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Shipping Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Any special requests or instructions..."
                ></textarea>
              </div>

              <div className="button-group">
                <button type="button" className="back-btn" onClick={prevStep}>
                  &larr; Back
                </button>
                <button type="submit" className="neon-button submit-btn email-btn">
                  Send Order by Email
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Order;
