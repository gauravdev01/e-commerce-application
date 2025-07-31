import React from 'react'
const DepartmentFilter = ({ 
  departments, 
  selectedDepartment, 
  onDepartmentChange, 
  onClearFilters 
}) => {
  if (!departments || departments.length === 0) {
    return (
      <div className="mb-6">
        <div className="text-sm text-gray-500">
          Loading departments...
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 w-full">
            Filter by Department
          </label>
          
          {/* Department Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onClearFilters}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                !selectedDepartment
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Departments
            </button>
            
            {departments.map(dept => (
              <button
                key={dept.id}
                onClick={() => onDepartmentChange(dept.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedDepartment === dept.id
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dept.name} ({dept.product_count})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepartmentFilter 
