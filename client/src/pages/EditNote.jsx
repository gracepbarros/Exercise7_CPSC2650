import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/notes/${id}`)
      .then(response => response.json())
      .then(data => {
        setText(data.text);
        setImage(data.image);
      });
  }, [id]);

  const handleSave = () => {
    fetch(`http://localhost:3000/notes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    }).then(() => navigate('/'));
  };

  return (
    <div>
      <p>Edit Note ID:  {id}</p>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSave}>Save</button>
      {image && (
        <div>
          <img src={image.url} alt={text} />
          <p>Photo by <a href={image.author_link} target="_blank" rel="noopener noreferrer">{image.author}</a></p>
        </div>
      )}
    </div>
  );
}

export default EditNote;
