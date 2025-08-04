import {useClient} from '@sanity/sdk-react'
import {Box,Button,Card,Flex,Select,Stack,TextInput,Label,Text} from '@sanity/ui'
import {useEffect,useState} from 'react'
import {Category,useCategories} from '../lib/useCategories'
import {ContentEditorModal} from './ContentEditorModal'

type ArticleMeta={_id:string;icon?:string;labels?:string[];categories?:{_ref:string}[]}

export function MetaPanel({id,onClose}:{id:string;onClose:()=>void}){
  const client=useClient({apiVersion:'2025-07-15'})
  const cats=useCategories()
  const [meta,setMeta]=useState<ArticleMeta|null>(null)
  const [icon,setIcon]=useState('')
  const [labels,setLabels]=useState('')
  const [catId,setCatId]=useState<string>('')
  const [showContentEditor,setShowContentEditor]=useState(false)

  useEffect(()=>{
    client.fetch<ArticleMeta>(`*[_id==$id][0]{_id,icon,labels,categories[]{_ref}}`,{id})
      .then(d=>{setMeta(d);setIcon(d?.icon??'');setLabels((d?.labels??[]).join(','));setCatId(d?.categories?.[0]?._ref??'')})
  },[client,id])

  const save=async()=>{
    if(!meta) return
    await client.patch(id)
      .set({
        icon:icon||undefined,
        labels:labels?labels.split(',').map(t=>t.trim()).filter(Boolean):[],
        categories:catId?[{_type:'reference',_ref:catId}]:[],
      })
      .commit({tag:'planner-meta'})
    onClose()
  }

  const handleContentSave=(content:string)=>{
    console.log('Content saved:',content)
    // You can add additional logic here if needed
  }

  if(!meta) return null

  return(
    <Card 
      padding={4} 
      radius={3} 
      shadow={2} 
      style={{
        width: 400,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }} 
      onClick={e=>e.stopPropagation()}
    >
      <Stack space={4}>
        {/* Header */}
        <Box
          style={{
            padding: '16px 0',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            marginBottom: '16px'
          }}
        >
          <Text size={2} weight="semibold" style={{ color: '#333' }}>
            Article Settings
          </Text>
          <Text size={1} style={{ color: '#666', marginTop: '4px' }}>
            Configure article metadata and content
          </Text>
        </Box>

        {/* Content Editor Section */}
        <Box
          style={{
            padding: '16px',
            background: 'rgba(102, 126, 234, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}
        >
          <Text size={1} weight="semibold" style={{ color: '#333', marginBottom: '12px' }}>
            Content Editor
          </Text>
          <Text size={1} style={{ color: '#666', marginBottom: '16px' }}>
            Edit the article's content with rich text formatting
          </Text>
          <ContentEditorModal
            documentId={id}
            fieldName="content"
            onClose={() => setShowContentEditor(false)}
            onSave={handleContentSave}
            triggerText="Open Content Editor"
          />
        </Box>

        {/* Metadata Section */}
        <Box
          style={{
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          <Text size={1} weight="semibold" style={{ color: '#333', marginBottom: '12px' }}>
            Metadata
          </Text>
          
          <Stack space={3}>
            <Box>
              <Label size={1}>Icon (emoji or name)</Label>
              <TextInput 
                value={icon} 
                onChange={e=>setIcon(e.currentTarget.value)}
                style={{
                  marginTop: '4px',
                  background: 'white',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px'
                }}
              />
            </Box>
            
            <Box>
              <Label size={1}>Labels (comma-separated)</Label>
              <TextInput 
                value={labels} 
                onChange={e=>setLabels(e.currentTarget.value)}
                style={{
                  marginTop: '4px',
                  background: 'white',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px'
                }}
              />
            </Box>
            
            <Box>
              <Label size={1}>Category</Label>
              <Select 
                value={catId} 
                onChange={e=>setCatId(e.currentTarget.value)}
                style={{
                  marginTop: '4px',
                  background: 'white',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px'
                }}
              >
                <option value="">None</option>
                {cats.map(c=><option key={c._id} value={c._id}>{c.title}</option>)}
              </Select>
            </Box>
          </Stack>
        </Box>

        {/* Actions */}
        <Flex gap={2} justify="flex-end">
          <Button 
            mode="ghost" 
            text="Cancel" 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
          />
          <Button 
            text="Save Metadata" 
            tone="primary" 
            onClick={save}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              transition: 'all 0.2s ease'
            }}
          />
        </Flex>
      </Stack>
    </Card>
  )
}
