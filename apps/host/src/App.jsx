import React, { Suspense, useState, useEffect } from 'react'

function App() {
  const [Button, setButton] = useState(null)
  const [Card, setCard] = useState(null)

  useEffect(() => {
    Promise.all([
      import('mfe1/Button'),
      import('mfe2/Card')
    ]).then(([mfe1, mfe2]) => {
      setButton(() => mfe1.Button)
      setCard(() => mfe2.Card)
    })
  }, [])

  return (
    <div>
      <h1>Host Application</h1>
      <p>Les MFEs sont chargés via Module Federation</p>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <Suspense fallback={<div>Chargement du bouton...</div>}>
          {Button && <Button onClick={() => alert('Bouton MFE1!')}>Bouton depuis MFE1</Button>}
        </Suspense>
        
        <Suspense fallback={<div>Chargement de la carte...</div>}>
          {Card && <Card title="Carte depuis MFE2">Contenu de la carte MFE2</Card>}
        </Suspense>
      </div>
    </div>
  )
}

export default App