import React, { FC, useState } from 'react'
import { StoragePlanItem } from 'store/Market/storage/interfaces'
import EditablePlanItem from '../../../molecules/storage/listing/EditablePlanItem'
import PlanItem from '../../../molecules/storage/listing/PlanItem'

export interface PlanItemWithEditProps {
  planItem: StoragePlanItem
}

const PlanItemWithEdit: FC<PlanItemWithEditProps> = ({ planItem }) => {
  const [editMode, setEditMode] = useState(false)

  const handleOnEditClick = () => {
    setEditMode(true)
  }

  const handleOnSaveClick = () => {
    setEditMode(false)
  }

  return (
    <>
      {
        editMode
        && (
          <EditablePlanItem
            planItem={planItem}
            onPlanSaved={handleOnSaveClick}
          />
        )
      }
      {
        !editMode
        && (
          <PlanItem planItem={planItem} onEditClick={handleOnEditClick} />
        )
      }
    </>
  )
}

export default PlanItemWithEdit