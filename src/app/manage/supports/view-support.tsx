'use client'

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"
import { Mail, Phone, Calendar, Clock, User, Send } from "lucide-react"
import { useGetSupportDetail, useUpdateSupportMutation } from "@/queries/useSupport"

export interface SupportMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  date: string
  createdAt?: string
  updatedAt?: string
  status: 'Pending' | 'Processing' | 'Resolved'
  replies?: {
    sender: 'Admin' | 'Customer'
    content: string
    timestamp: string
  }[]
}

interface Props {
  id: string | undefined
  setId: (value: string | undefined) => void
  onUpdate?: (updated: SupportMessage) => void
}

export default function ViewSupport({ id, setId, onUpdate }: Props) {
  const [replyText, setReplyText] = useState('')
  const [status, setStatus] = useState<'Pending' | 'Processing' | 'Resolved'>('Pending')

  const { data: supportDetailRes } = useGetSupportDetail(id as string, !!id)
  const message = supportDetailRes?.payload?.data as SupportMessage | undefined
  const updateSupportMutation = useUpdateSupportMutation()

  useEffect(() => {
    if (message) {
      setStatus(message.status)
    }
  }, [message])

  useEffect(() => {
    if (!id) {
      setReplyText('')
    }
  }, [id])

  const handleSendReply = async () => {
    if (!message || !replyText.trim()) return

    const newReply = {
      sender: 'Admin' as const,
      content: replyText.trim(),
      timestamp: new Date().toLocaleString('vi-VN')
    }

    const updatedReplies = [...(message.replies || []), newReply]

    try {
      await updateSupportMutation.mutateAsync({
        id: message.id,
        status: 'Resolved', // auto resolve upon reply
        replies: updatedReplies
      })
      setReplyText('')
      if (onUpdate) {
        onUpdate({
          ...message,
          status: 'Resolved',
          replies: updatedReplies
        })
      }
      toast.success('Gửi phản hồi cho khách hàng thành công!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi phản hồi.')
    }
  }

  const handleStatusChange = async (val: 'Pending' | 'Processing' | 'Resolved') => {
    if (!message) return
    try {
      await updateSupportMutation.mutateAsync({
        id: message.id,
        status: val,
        replies: message.replies
      })
      setStatus(val)
      if (onUpdate) {
        onUpdate({
          ...message,
          status: val
        })
      }
      toast.success(`Cập nhật trạng thái phản hồi: ${
        val === 'Pending' ? 'Chờ xử lý' : val === 'Processing' ? 'Đang xử lý' : 'Đã phản hồi'
      }`)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái.')
    }
  }

  const reset = () => {
    setId(undefined)
  }

  return (
    <Dialog open={Boolean(id)} onOpenChange={(val) => {
      if (!val) reset()
    }}>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto font-sans'>
        <DialogHeader>
          <DialogTitle className="font-serif text-xl border-b pb-2">Chi tiết Yêu cầu Hỗ trợ</DialogTitle>
        </DialogHeader>

        {message && (
          <div className="space-y-6 pt-2">
            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-muted/40 p-4 rounded-xl border">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium">{message.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>{message.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">{message.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <span>{new Date(message.createdAt || message.date).toLocaleString('vi-VN')}</span>
              </div>
            </div>

            {/* Conversation Log */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Nội dung hội thoại</h4>
              <div className="border rounded-xl p-4 bg-muted/20 space-y-4 max-h-60 overflow-y-auto">
                {/* Customer Original message */}
                <div className="flex flex-col items-start max-w-[85%] space-y-1">
                  <div className="bg-muted text-foreground p-3 rounded-2xl rounded-tl-none text-sm">
                    {message.message}
                  </div>
                  <span className="text-[10px] text-muted-foreground ml-1">
                    Khách hàng - {new Date(message.createdAt || message.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Replies */}
                {message.replies?.map((reply, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col max-w-[85%] space-y-1 ${
                      reply.sender === 'Admin' ? 'items-end ml-auto' : 'items-start'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl text-sm ${
                      reply.sender === 'Admin' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-muted text-foreground rounded-tl-none'
                    }`}>
                      {reply.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground mr-1">
                      {reply.sender === 'Admin' ? 'Hệ thống' : 'Khách hàng'} - {reply.timestamp.split(' ')[1] || reply.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Send Reply */}
            <div className="space-y-2 border-t pt-4">
              <h4 className="font-semibold text-sm">Gửi phản hồi qua email</h4>
              <div className="flex gap-2 items-start">
                <Textarea 
                  placeholder="Nhập nội dung thư trả lời khách hàng..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="text-sm min-h-20"
                />
                <Button 
                  onClick={handleSendReply} 
                  disabled={!replyText.trim() || updateSupportMutation.isPending}
                  className="shrink-0 h-10 w-10 p-0 flex items-center justify-center rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Change Status */}
            <FieldGroup className="border-t pt-4">
              <Field>
                <FieldLabel className="font-semibold text-sm">Trạng thái phiếu hỗ trợ</FieldLabel>
                <Select 
                  value={status} 
                  disabled={updateSupportMutation.isPending}
                  onValueChange={(val: 'Pending' | 'Processing' | 'Resolved') => handleStatusChange(val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Chờ xử lý (Pending)</SelectItem>
                    <SelectItem value="Processing">Đang xử lý (Processing)</SelectItem>
                    <SelectItem value="Resolved">Đã phản hồi (Resolved)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </div>
        )}

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={reset}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
