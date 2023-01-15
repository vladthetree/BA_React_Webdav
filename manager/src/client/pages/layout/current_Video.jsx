import React, { forwardRef } from 'react'

const CurrentVideo = forwardRef((props, ref) => {

    return <div ref={ref} className="box box_uper_right">Current Video</div>
})
export default CurrentVideo
