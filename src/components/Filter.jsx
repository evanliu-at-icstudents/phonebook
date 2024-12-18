const Filter = ({ value, onChange}) => {
    return (
        <div>
            Filter: <input value = {value} onChange = {onChange} />
        </div>
    )
}

export default Filter