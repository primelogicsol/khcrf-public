import { useState, useEffect } from "react";
import { partnerApi } from "@/lib/api";
import { computeGlobalReachMetrics } from "@/lib/partnerRegistryAdapter";

export interface RegistryPartner {
  id: string;
  orgName: string;
  name?: string;
  referenceId?: string;
  displayId?: string;
  collection: string;
  status: string;
  country?: string;
  logoUrl?: string;
  collaborationType: string[];
  collaborationTypes?: string[];
  collaborationAreas?: string[];
  projectDescription?: string;
  engagementDescription?: string;
}

export function usePartnerNetworkCollections() {
  const [data, setData] = useState({
    coreEcosystem: [] as RegistryPartner[],
    specializedEnterprises: [] as RegistryPartner[],
    institutionalAlliances: [] as RegistryPartner[],
    allPartners: [] as RegistryPartner[]
  });
  
  const [counts, setCounts] = useState({
    coreEcosystem: 0,
    specializedEnterprises: 0,
    institutionalAlliances: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const raw = await partnerApi.getPublic();
        let list: RegistryPartner[] = [];
        if (Array.isArray(raw)) {
          list = raw;
        } else if (raw && Array.isArray(raw.data)) {
          list = raw.data;
        } else if (raw && raw.data && Array.isArray(raw.data.data)) {
          list = raw.data.data;
        } else {
          throw new Error("Invalid public registry response");
        }

        if (isMounted) {
          const core = list.filter((p) => p.collection === "core-ecosystem" || p.collection === "internal-module");
          const specialized = list.filter((p) => p.collection === "specialized-enterprise");
          const institutional = list.filter((p) => p.collection === "institutional-alliance");

          setData({
            coreEcosystem: core,
            specializedEnterprises: specialized,
            institutionalAlliances: institutional,
            allPartners: list
          });

          const metrics = computeGlobalReachMetrics(list);

          setCounts({
            coreEcosystem: metrics.ecosystemCount || 0,
            specializedEnterprises: metrics.sisterOrgCount || 0,
            institutionalAlliances: metrics.approvedPartnerCount || 0
          });
          
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { ...data, counts, loading, error };
}
