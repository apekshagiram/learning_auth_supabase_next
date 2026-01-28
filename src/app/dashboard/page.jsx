import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout, addNote } from './actions'

export default async function Dashboard() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data: notes } = await supabase
  .from('notes')
  .select('*')
  .order('created_at', { ascending: false })



  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#333'
            }}>
              Welcome! 👋
            </h1>
            <p style={{
              color: '#666',
              fontSize: '1.1rem'
            }}>
              {user.email}
            </p>
          </div>
          
          {/* Logout – server action */}
          <form action={logout}>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </form>
        </div>

        <div style={{
          padding: '30px',
          background: '#f8f9fa',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '1.2rem',
            color: '#28a745',
            fontWeight: '500',
            margin: 0
          }}>
            🎉 You are successfully logged in!
          </p>
        </div>

        {/* Notes Section */}
        <div style={{ marginTop: '30px' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '20px'
          }}>
            Your Notes
          </h2>

          <form action={async (formData) => {
            'use server'
            const title = formData.get('title')
            if (title && title.trim()) {
              await addNote(title.trim())
            }
          }} style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <input
                type="text"
                name="title"
                placeholder="Enter a new note..."
                required
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '12px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  color: '#333'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Add Note
              </button>
            </div>
          </form>

          {notes && notes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    padding: '16px 20px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    borderLeft: '4px solid #667eea'
                  }}
                >
                  <p style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    color: '#333',
                    margin: 0
                  }}>
                    {note.title}
                  </p>
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#888',
                    margin: '8px 0 0 0'
                  }}>
                    {new Date(note.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '40px',
              background: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{
                color: '#888',
                fontSize: '1rem',
                margin: 0
              }}>
                No notes yet. Create your first note!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
