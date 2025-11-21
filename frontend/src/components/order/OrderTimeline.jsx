import React from 'react'
import './OrderTimeline.css'

const OrderTimeline = ({ timeline, orderStatus }) => {
  const statusOrder = ['Pending', 'Processing', 'Shipped', 'Delivered']
  const currentStatusIndex = statusOrder.indexOf(orderStatus)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return '🕐'
      case 'Processing':
        return '⚙️'
      case 'Shipped':
        return '🚚'
      case 'Delivered':
        return '✅'
      case 'Cancelled':
        return '❌'
      default:
        return '📦'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (orderStatus === 'Cancelled') {
    return (
      <div className="order-timeline cancelled">
        <h3>Order Timeline</h3>
        <div className="timeline-container">
          {timeline.map((event, index) => (
            <div key={index} className="timeline-item cancelled">
              <div className="timeline-icon">{getStatusIcon(event.status)}</div>
              <div className="timeline-content">
                <div className="timeline-status">{event.status}</div>
                <div className="timeline-date">{formatDate(event.timestamp)}</div>
                {event.note && <div className="timeline-note">{event.note}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="order-timeline">
      <h3>Order Timeline</h3>
      <div className="timeline-container">
        {statusOrder.map((status, index) => {
          const isCompleted = index <= currentStatusIndex
          const isCurrent = index === currentStatusIndex
          const timelineEvent = timeline.find((event) => event.status === status)

          return (
            <div
              key={status}
              className={`timeline-item ${isCompleted ? 'completed' : ''} ${
                isCurrent ? 'current' : ''
              }`}
            >
              <div className="timeline-icon">{getStatusIcon(status)}</div>
              <div className="timeline-content">
                <div className="timeline-status">{status}</div>
                {timelineEvent && (
                  <>
                    <div className="timeline-date">
                      {formatDate(timelineEvent.timestamp)}
                    </div>
                    {timelineEvent.note && (
                      <div className="timeline-note">{timelineEvent.note}</div>
                    )}
                  </>
                )}
              </div>
              {index < statusOrder.length - 1 && (
                <div className={`timeline-line ${isCompleted ? 'completed' : ''}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Show additional timeline events */}
      {timeline.length > statusOrder.length && (
        <div className="additional-events">
          <h4>Additional Updates</h4>
          {timeline
            .filter((event) => !statusOrder.includes(event.status))
            .map((event, index) => (
              <div key={index} className="timeline-item additional">
                <div className="timeline-icon">{getStatusIcon(event.status)}</div>
                <div className="timeline-content">
                  <div className="timeline-status">{event.status}</div>
                  <div className="timeline-date">{formatDate(event.timestamp)}</div>
                  {event.note && <div className="timeline-note">{event.note}</div>}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default OrderTimeline
