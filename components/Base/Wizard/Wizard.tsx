'use client'

import { useState, useCallback, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { FormField } from '@/components/Base/Views/FormView/FormView'
import { FormViewValidator, type ValidationRules } from '@/components/Base/Views/FormView/utils/validation'

import {
  SelectionField,
  Many2ManyField,
  Many2OneField,
  One2ManyField,
  BooleanField,
  StringField,
  NumberField,
  TextareaField,
  HtmlField,
  JsonField,
  DateField,
  DatetimeField,
  TimeField,
  YearField,
  MonthField,
  DayField,
  FileField,
} from '@/components/Base/Fields'

// ─── Types ──────────────────────────────────────────────────────────

export interface WizardStep {
  key: string
  title: string
  description?: string
  icon?: ReactNode
  fields?: FormField[]
  validation?: ValidationRules
  show?: (data: any) => boolean
  component?: React.ComponentType<{
    data: any
    onDataChange: (data: any) => void
  }>
}

export interface WizardConfig {
  steps: WizardStep[]
  onComplete: (data: any) => void | Promise<void>
  onCancel?: () => void
  initialData?: Record<string, any>
  submitLabel?: string
  showSteps?: boolean
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

interface WizardProps {
  config: WizardConfig
}

// ─── Field renderer ─────────────────────────────────────────────────

const fieldComponents: Record<string, React.ComponentType<any>> = {
  selection: SelectionField,
  many2many: Many2ManyField,
  many2one: Many2OneField,
  one2many: One2ManyField,
  boolean: BooleanField,
  string: StringField,
  number: NumberField,
  textarea: TextareaField,
  html: HtmlField,
  json: JsonField,
  date: DateField,
  datetime: DatetimeField,
  time: TimeField,
  year: YearField,
  month: MonthField,
  day: DayField,
  file: FileField,
  checkbox: BooleanField,
  toggle: BooleanField,
  array: JsonField,
}

function renderWizardField(
  field: FormField,
  value: any,
  onChange: (val: any) => void,
  error?: string | null
): ReactNode {
  const FieldComponent = fieldComponents[field.type]
  if (!FieldComponent) {
    return (
      <div className="rounded border border-dashed border-muted-foreground/30 p-3 text-sm text-muted-foreground">
        Unknown field type: <code>{field.type}</code>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <FieldComponent
        config={{
          name: field.key,
          type: field.type as any,
          label: field.label,
          placeholder: field.placeholder,
          required: field.required,
          readonly: field.readonly,
          helper: field.helper,
        }}
        value={value}
        onChange={onChange}
        error={error}
      />
    </div>
  )
}

// ─── Step indicator ─────────────────────────────────────────────────

function StepIndicator({
  steps,
  currentIndex,
  orientation,
}: {
  steps: WizardStep[]
  currentIndex: number
  orientation: 'horizontal' | 'vertical'
}) {
  const visibleSteps = steps

  if (orientation === 'vertical') {
    return (
      <div className="flex flex-col gap-0">
        {visibleSteps.map((step, index) => {
          const isActive = index === currentIndex
          const isCompleted = index < currentIndex
          const isUpcoming = index > currentIndex
          return (
            <div key={step.key} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                    isActive && 'border-primary bg-primary text-primary-foreground',
                    isCompleted && 'border-primary bg-primary text-primary-foreground',
                    isUpcoming && 'border-muted-foreground/30 text-muted-foreground'
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.icon || index + 1}
                </div>
                {index < visibleSteps.length - 1 && (
                  <div
                    className={cn(
                      'my-1 w-0.5 grow',
                      isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'
                    )}
                    style={{ minHeight: '24px' }}
                  />
                )}
              </div>
              <div className={cn('pb-6 pt-1', isUpcoming && 'opacity-40')}>
                <p className="text-sm font-medium">{step.title}</p>
                {step.description && (
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-0">
      {visibleSteps.map((step, index) => {
        const isActive = index === currentIndex
        const isCompleted = index < currentIndex
        const isUpcoming = index > currentIndex
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                  isActive && 'border-primary bg-primary text-primary-foreground',
                  isCompleted && 'border-primary bg-primary text-primary-foreground',
                  isUpcoming && 'border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.icon || index + 1}
              </div>
              <span
                className={cn(
                  'text-xs whitespace-nowrap',
                  isActive && 'font-medium text-foreground',
                  isCompleted && 'text-primary',
                  isUpcoming && 'text-muted-foreground'
                )}
              >
                {step.title}
              </span>
            </div>
            {index < visibleSteps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-0.5 w-16',
                  isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Wizard component ──────────────────────────────────────────

export function Wizard({ config }: WizardProps) {
  const [data, setData] = useState<Record<string, any>>(config.initialData || {})
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [submitting, setSubmitting] = useState(false)

  const visibleSteps = config.steps.filter((step) => !step.show || step.show(data))
  const currentStepConfig = visibleSteps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === visibleSteps.length - 1
  const progress = visibleSteps.length > 1
    ? Math.round((currentStep / (visibleSteps.length - 1)) * 100)
    : 100

  const updateData = useCallback((key: string, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const validateCurrentStep = useCallback((): boolean => {
    if (!currentStepConfig?.validation) {
      setErrors({})
      return true
    }

    const stepErrors = FormViewValidator.validateForm(data, currentStepConfig.validation)
    setErrors(stepErrors)
    return !FormViewValidator.hasErrors(stepErrors)
  }, [currentStepConfig, data])

  const handleNext = useCallback(() => {
    if (!validateCurrentStep()) return
    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setErrors({})
    }
  }, [validateCurrentStep, currentStep, visibleSteps.length])

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      setErrors({})
    }
  }, [currentStep])

  const handleSubmit = useCallback(async () => {
    if (!validateCurrentStep()) return
    setSubmitting(true)
    try {
      await config.onComplete(data)
    } finally {
      setSubmitting(false)
    }
  }, [validateCurrentStep, config, data])

  const orientation = config.orientation || 'horizontal'
  const showSteps = config.showSteps !== false

  if (!currentStepConfig) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        No steps to display.
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', config.className)}>
      {/* Step indicator */}
      {showSteps && visibleSteps.length > 1 && (
        <div className="space-y-4">
          <StepIndicator
            steps={visibleSteps}
            currentIndex={currentStep}
            orientation={orientation}
          />
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      {/* Step header */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{currentStepConfig.title}</h3>
        {currentStepConfig.description && (
          <p className="text-sm text-muted-foreground">{currentStepConfig.description}</p>
        )}
      </div>

      {/* Step content */}
      <div className="space-y-4">
        {currentStepConfig.component ? (
          <currentStepConfig.component
            data={data}
            onDataChange={(newData) => setData((prev) => ({ ...prev, ...newData }))}
          />
        ) : (
          currentStepConfig.fields?.map((field) => (
            <div key={field.key}>
              {renderWizardField(
                field,
                data[field.key],
                (val) => updateData(field.key, val),
                errors[field.key]
              )}
            </div>
          ))
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t pt-4">
        <div>
          {config.onCancel && (
            <Button appearance="ghost" onClick={config.onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isFirstStep && (
            <Button appearance="subtle" onClick={handlePrevious}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
          )}
          {isLastStep ? (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : config.submitLabel || 'Complete'}
              {!submitting && <Check className="ml-2 h-4 w-4" />}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
