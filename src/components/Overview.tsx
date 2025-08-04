import { useSanityClient } from '../SanityClientContext'
import { Box, Card, Label, Select, Spinner, Text, Button, Flex } from '@sanity/ui'
import { useEffect, useState } from 'react'
import { useStatuses } from '../lib/useStatuses'
import { useCategories } from '../lib/useCategories'
import { FilterIcon, RefreshIcon } from '@sanity/icons'

type Row = {
  _id: string
  title: string
  status?: { _ref: string }
  categories?: { _ref: string }[]
  author?: string
}

const Q = `*[_type=="article"]{
  _id,title,status,categories[]{_ref},
  "author": coalesce(author->name,"—")
}`

export function Overview() {
  const client = useSanityClient()
  const [rows, setRows] = useState<Row[]>([])
  const [busy, setBusy] = useState(true)
  useEffect(() => { client.fetch<Row[]>(Q).then(r => { setRows(r); setBusy(false) }) }, [client])

  const statuses = useStatuses()
  const cats = useCategories()

  const [fltStatus, setFltStatus] = useState('')
  const [fltCat, setFltCat] = useState('')

  const filtered = rows.filter(r => {
    const okS = !fltStatus || r.status?._ref === fltStatus
    const okC = !fltCat || r.categories?.some(c => c._ref === fltCat)
    return okS && okC
  })

  if (busy) return (
    <Box 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <Spinner size={4} />
    </Box>
  )

  return (
    <Box>
      {/* Overview Header */}
      <Box 
        style={{
          marginBottom: '24px',
          padding: '20px 24px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Flex justify="space-between" align="center">
          <Box>
            <Text 
              size={2} 
              weight="semibold"
              style={{
                color: '#333',
                marginBottom: '8px',
                display: 'block'
              }}
            >
              Content Overview
            </Text>
            <Text 
              size={1}
              style={{
                color: '#666',
                fontSize: '14px'
              }}
            >
              {filtered.length} of {rows.length} articles
            </Text>
          </Box>
          
          <Button
            mode="ghost"
            padding={2}
            radius={2}
            onClick={() => window.location.reload()}
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <RefreshIcon />
          </Button>
        </Flex>
      </Box>

      {/* Filters */}
      <Card 
        padding={4} 
        radius={3} 
        style={{
          marginBottom: '24px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Flex gap={3} align="center" style={{ marginBottom: '16px' }}>
          <FilterIcon style={{ color: '#667eea' }} />
          <Label size={1} style={{ color: '#333', fontWeight: '600' }}>Filters</Label>
        </Flex>
        
        <Flex gap={3} align="center">
          <Box style={{ flex: 1 }}>
            <Label size={1} style={{ marginBottom: '8px', display: 'block', color: '#666' }}>
              Status
            </Label>
            <Select 
              value={fltStatus} 
              onChange={e => setFltStatus(e.currentTarget.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '6px',
                background: 'white',
                fontSize: '14px'
              }}
            >
              <option value="">All statuses</option>
              {statuses.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
            </Select>
          </Box>
          
          <Box style={{ flex: 1 }}>
            <Label size={1} style={{ marginBottom: '8px', display: 'block', color: '#666' }}>
              Category
            </Label>
            <Select 
              value={fltCat} 
              onChange={e => setFltCat(e.currentTarget.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '6px',
                background: 'white',
                fontSize: '14px'
              }}
            >
              <option value="">All categories</option>
              {cats.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </Select>
          </Box>
        </Flex>
      </Card>

      {/* Table */}
      <Card 
        padding={0} 
        radius={3} 
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
      >
        <Box style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{
                background: 'rgba(102, 126, 234, 0.1)',
                borderBottom: '1px solid rgba(102, 126, 234, 0.2)'
              }}>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 20px',
                  fontWeight: '600',
                  color: '#333',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Title
                </th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 20px',
                  fontWeight: '600',
                  color: '#333',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Status
                </th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 20px',
                  fontWeight: '600',
                  color: '#333',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Author
                </th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 20px',
                  fontWeight: '600',
                  color: '#333',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Categories
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, index) => (
                <tr 
                  key={r._id}
                  style={{
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <td style={{
                    padding: '16px 20px',
                    color: '#333',
                    fontWeight: '500'
                  }}>
                    {r.title}
                  </td>
                  <td style={{
                    padding: '16px 20px',
                    color: '#666'
                  }}>
                    {statuses.find(s => s._id === r.status?._ref)?.title ?? '—'}
                  </td>
                  <td style={{
                    padding: '16px 20px',
                    color: '#666'
                  }}>
                    {r.author ?? '—'}
                  </td>
                  <td style={{
                    padding: '16px 20px',
                    color: '#666'
                  }}>
                    {(r.categories ?? [])
                      .map(c => cats.find(x => x._id === c._ref)?.title)
                      .filter(Boolean)
                      .join(', ') || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Card>
    </Box>
  )
}
