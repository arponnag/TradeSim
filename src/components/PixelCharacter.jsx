export default function PixelCharacter({ emotion = 'happy', size = 'medium' }) {
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-3xl',
    large: 'text-5xl'
  };

  const characters = {
    happy: (
      <div className={`${sizeClasses[size]} leading-none filter drop-shadow-lg`} style={{ filter: 'drop-shadow(0 0 10px #00ff00)' }}>
        <pre className="font-mono" style={{ color: '#00ff00' }}>
{`  ╔═══╗
 ╔╝   ╚╗
╔╝  ║  ╚╗
║ ╔═══╗ ║
║ ║ ^_^║ ║
║ ╚═══╝ ║
╚╗ ║ ║ ╔╝
 ╚╗   ╔╝
  ╚═══╝`}
        </pre>
      </div>
    ),
    thinking: (
      <div className={`${sizeClasses[size]} leading-none`} style={{ filter: 'drop-shadow(0 0 10px #00ffff)' }}>
        <pre className="font-mono" style={{ color: '#00ffff' }}>
{`  ╔═══╗
 ╔╝   ╚╗
╔╝  ?  ╚╗
║ ╔═══╗ ║
║ ║ -.-║ ║
║ ╚═══╝ ║
╚╗ ║ ║ ╔╝
 ╚╗   ╔╝
  ╚═══╝`}
        </pre>
      </div>
    ),
    worried: (
      <div className={`${sizeClasses[size]} leading-none`} style={{ filter: 'drop-shadow(0 0 10px #ff6b6b)' }}>
        <pre className="font-mono" style={{ color: '#ff6b6b' }}>
{`  ╔═══╗
 ╔╝   ╚╗
╔╝  ║  ╚╗
║ ╔═══╗ ║
║ ║ >_<║ ║
║ ╚═══╝ ║
╚╗ ║ ║ ╔╝
 ╚╗   ╔╝
  ╚═══╝`}
        </pre>
      </div>
    ),
    excited: (
      <div className={`${sizeClasses[size]} leading-none`} style={{ filter: 'drop-shadow(0 0 10px #ffd700)' }}>
        <pre className="font-mono" style={{ color: '#ffd700' }}>
{`  ╔═══╗
 ╔╝   ╚╗
╔╝  ║  ╚╗
║ ╔═══╗ ║
║ ║ O_O║ ║
║ ╚═══╝ ║
╚╗ ║ ║ ╔╝
 ╚╗   ╔╝
  ╚═══╝`}
        </pre>
      </div>
    ),
    neutral: (
      <div className={`${sizeClasses[size]} leading-none`} style={{ filter: 'drop-shadow(0 0 10px #00ffff)' }}>
        <pre className="font-mono" style={{ color: '#00ffff' }}>
{`  ╔═══╗
 ╔╝   ╚╗
╔╝  ║  ╚╗
║ ╔═══╗ ║
║ ║ -_-║ ║
║ ╚═══╝ ║
╚╗ ║ ║ ╔╝
 ╚╗   ╔╝
  ╚═══╝`}
        </pre>
      </div>
    )
  };

  return (
    <div className="inline-block">
      {characters[emotion] || characters.neutral}
    </div>
  );
}

