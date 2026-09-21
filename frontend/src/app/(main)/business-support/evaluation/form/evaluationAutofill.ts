import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { EntityType } from '@/data/evaluationRegistry';

export function useEvaluationAutofill({
  searchParams,
  currentStep,
  factors,
  getFactorCriteria,
  setCurrentStep,
  setEvaluationId,
  setTrackingId,
  setEntityType,
  setEntityName,
  setCraftType,
  setSecondaryCrafts,
  setRoleInValueChain,
  setDistrict,
  setYearsActive,
  setOperatingScale,
  setPrincipalMarkets,
  setExistingRegistration,
  setResponses,
  isCheckingStatus,
  entityType,
  roleInValueChain,
  craftType,
  evaluationId
}: any) {
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const stepInProgressRef = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const autofillParam = searchParams?.get('autofill');
    if (!autofillParam) return;
    setIsRunning(true);
  }, [searchParams]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (!isRunning || isCheckingStatus) return;
    if (stepInProgressRef.current) return;

    // Stop at Step 15 (index factors.length + 1)
    if (currentStep >= factors.length + 1) {
      setIsRunning(false);
      setIsComplete(true);
      return;
    }

    stepInProgressRef.current = true;

    (async () => {
      try {
        if (currentStep === 0) {
          // Fill state
          setEntityType('BUSINESS');
          setEntityName('KHCRF Evidence Upload Test Entity');
          setCraftType('PASHMINA');
          setSecondaryCrafts('');
          setRoleInValueChain('MANUFACTURER');
          setDistrict('Srinagar');
          setYearsActive('5');
          setOperatingScale('Medium');
          setPrincipalMarkets('Domestic');
          setExistingRegistration('None');
          
          // POST API
          const payload = {
            entityType: 'BUSINESS',
            entityName: 'KHCRF Evidence Upload Test Entity',
            craftType: 'PASHMINA',
            additionalInfo: {
              secondaryCrafts: '', 
              roleInValueChain: 'MANUFACTURER', 
              district: 'Srinagar', 
              yearsActive: '5', 
              operatingScale: 'Medium', 
              principalMarkets: 'Domestic', 
              existingRegistration: 'None'
            }
          };
          const res = await api.post("/evaluation", payload);
          setEvaluationId(res.data.id);
          setTrackingId(res.data.trackingId);
          setCurrentStep(1);
        } else if (currentStep <= factors.length) {
          // Fill Factor
          const factorCode = factors[currentStep - 1];
          const criteria = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, factorCode);
          
          const updates: Record<string, any> = {};
          
          criteria.questions.forEach((q: any) => {
            if (q.required) {
               const key = `${factorCode}_${q.id}`;
               if (q.type === 'YES_NO') updates[key] = 'Yes';
               else if (q.type === 'QUALITATIVE') updates[key] = 'Meets completely';
               else if (q.type === 'SELECT') updates[key] = (q.options || [])[0] || 'Selected';
               else updates[key] = 'Temporary evidence pipeline acceptance test record.';
            }
          });
          
          setResponses((prev: any) => ({ ...prev, ...updates }));
          
          // PATCH API
          if (evaluationId) {
            await api.patch(`/evaluation/${evaluationId}`, { answers: updates });
          }
          
          setCurrentStep((prev: number) => prev + 1);
        }
      } catch (e) {
        console.error('Autofill error:', e);
        setIsRunning(false);
      } finally {
        stepInProgressRef.current = false;
      }
    })();
  }, [isRunning, currentStep, isCheckingStatus, factors, entityType, roleInValueChain, craftType, evaluationId]);

  return { isRunning, isComplete, currentStep };
}
