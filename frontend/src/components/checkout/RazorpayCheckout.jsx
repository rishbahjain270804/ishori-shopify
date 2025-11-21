import React from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

const RazorpayCheckout = ({ orderId, amount, onSuccess, onFailure }) => {
  const loadRazorpay = async () => {
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      // Create payment order
      const { data } = await axios.post('/api/payments/create-order', {
        orderId,
        amount,
      }, config)

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment order')
      }

      const { razorpayOrderId, key } = data.data

      // Razorpay options
      const options = {
        key: key,
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'Ishori Sarees',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const token = localStorage.getItem('token')
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }

            // Verify payment
            const verifyResponse = await axios.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, config)

            if (verifyResponse.data.success) {
              toast.success('Payment successful!')
              onSuccess(verifyResponse.data.data)
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error(error.response?.data?.message || 'Payment verification failed')
            onFailure(error)
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#9333ea',
        },
        modal: {
          ondismiss: function () {
            toast.info('Payment cancelled')
            onFailure(new Error('Payment cancelled by user'))
          },
        },
      }

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Razorpay error:', error)
      toast.error(error.response?.data?.message || 'Failed to initialize payment')
      onFailure(error)
    }
  }

  return { loadRazorpay }
}

export default RazorpayCheckout
