import "@k2oss/k2-broker-core";

metadata = {
  systemName: "GenerateDocument",
  displayName: "Generate Document",
  description: "Service to generate document",
  configuration: {
    mbh: {
      displayName: "MBH Workflow",
      type: "string",
    },
    anotherWorkflow: {
      displayName: "Another Workflow",
      type: "string",
    },
    ServiceKey: {
      displayName: "Service Key for document generation",
      type: "number",
      required: true,
      value: "1",
    },
    stringFormat: {
            displayName: "String Format",
            type: "string",
            value: "Alphanumeric"
    }
  },
};

ondescribe = async function ({ configuration }): Promise<void> {
  const documentType = configuration["documentType"] ? configuration["documentType"].toString() : "pdf";

  postSchema({
    objects: {
      document: {
        displayName: "Document",
        description: "Manages document generation",
        properties: {
          id: {
            displayName: "ID",
            type: "number",
          },
          name: {
            displayName: "Name",
            type: "string",
          },
          type: {
            displayName: "Type",
            type: "string",
          },
          base64Data: {
            displayName: "Base64 Data",
            type: "string",
          },
          jsonData1: {
            displayName: "JSON Data 1",
            type: "string",
          },
          jsonData2: {
            displayName: "JSON Data 2",
            type: "string",
          },
          jsonData3: {
            displayName: "JSON Data 3",
            type: "string",
          },
          jsonData4: {
            displayName: "JSON Data 4",
            type: "string",
          },
          documentType: {
            displayName: "Document Type",
            type: "string",
          },
        },
        methods: {
          generate: {
            displayName: "Generate Document",
            type: "execute",
            inputs: ["id", "name", "type", "base64Data", "jsonData1", "jsonData2", "jsonData3", "jsonData4", "documentType"],
            outputs: ["jsonResult"],
          },
        },
      },
    },
  });
};

onexecute = async function ({
  objectName,
  methodName,
  parameters,
  properties,
  configuration,
  schema,
}): Promise<void> {
  switch (objectName) {
    case "document":
      await onexecuteDocument(methodName, properties, parameters, configuration);
      break;
    default:
      throw new Error("The object " + objectName + " is not supported.");
  }
};

async function onexecuteDocument(
  methodName: string,
  properties: SingleRecord,
  parameters: SingleRecord,
  configuration: SingleRecord
): Promise<void> {
  switch (methodName) {
    case "generate":
      await onexecuteGenerateDocument(properties, configuration);
      break;
    default:
      throw new Error("The method " + methodName + " is not supported.");
  }
}

async function onexecuteGenerateDocument(
  properties: SingleRecord,
  configuration: SingleRecord
): Promise<void> {
  try {
    const workflowType = properties["type"].toString(); 
    const documentType = properties["documentType"].toString(); 
    const jsonResult = await buildJsonRequest(properties, workflowType, documentType);

    postResult({
      jsonResult: JSON.stringify(jsonResult),
    });
  } catch (error) {
    throw new Error("Error generating document: " + error.message);
  }
}

function buildJsonRequest(properties: SingleRecord, workflowType: string, documentType: string): Promise<any> {
  switch (workflowType) {
    case "mbh":
      return buildMbhJson(properties, documentType);
    case "anotherWorkflow":
      return Promise.resolve({ message: "Another workflow not implemented yet." });
    default:
      return Promise.reject(new Error("Unsupported workflow type: " + workflowType));
  }
}

function buildMbhJson(properties: SingleRecord, documentType: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    try {
      const payload1 = JSON.parse(properties["jsonData1"].toString());
      const payload2 = JSON.parse(properties["jsonData2"].toString());
      const payload3 = JSON.parse(properties["jsonData3"].toString());
      const payload4 = JSON.parse(properties["jsonData4"].toString());

      const action_plan = payload2.value;
      const history = payload3.value;
      const document_attach = payload4.value;

      console.log("document_attach", document_attach);
      const documentMap = document_attach.reduce((map, document) => {
        map[document.NCR_ID] = document["File@odata.mediaReadLink"];
        return map;
      }, {});

      const tableDataPlan = action_plan.map((action) => ({
        plan_A: action.MBH_NCR_Description || "",
        plan_B: action.MBH_NCR_ActionPICEmail || "",
        plan_C: action.MBH_NCR_PlanDate.substring(0, 10) || "",
        plan_D: action.MBH_NCR_Response || "",
        plan_E: action.MBH_NCR_ExectionDate.substring(0, 10) || "",
        plan_F: documentMap[action.MBH_NCR_NCRID_fk] || "",
      }));

      const tableDataAction = action_plan.map((resume) => ({
        resume_A: resume.MBH_NCR_Description || "",
        resume_B: resume.MBH_NCR_PlanDate.substring(0, 10) || "",
        resume_C: resume.MBH_NCR_ActionPlanApprovalStatusByQuality || "",
        resume_D: resume.MBH_NCR_ActionPlanApprovalStatusByClient || "",
        resume_E: resume.MBH_NCR_ActionResponseApprovalStatusByPlanPIC === "Oui" ? "Satisfaisant" : "",
        resume_F: resume.MBH_NCR_ActionResponseApprovalStatusByClient || "",
      }));

      const tableDataHistory = history.map((history) => ({
        historique_A: history.ODataProperty__GCPC_NCR_PICEmail || "",
        historique_B: history.GCPC_NCR_ResponseDate.substring(0, 10) || "",
        historique_C: history.GCPC_NCR_Step || "",
        historique_D: history.GCPC_NCR_Comment || "",
      }));

      const tableDataAttachdocument = document_attach.map((document) => ({
        doc_A: document.FileName || "",
        doc_B: document.FileDescription || "",
        doc_C: document.Comment || "",
        doc_D: document.UploadedBy || "",
        doc_E: document.Upload_Date.substring(0, 10) || "",
        doc_F: document.FileName || "",
        doc_G: document["File@odata.mediaReadLink"] || "",
        doc_H: document.Step || "",
      }));

      console.log("payload1", payload1);

      const jsonObject = {
        instance_A: payload1.UCI || "",
        instance_B: "MBH NCR",
        instance_C: payload1.NCRStatus || "",
        instance_D: payload1.InitiatorName || "",
        instance_E: payload1.InitiatorEmail || "",
        instance_F: payload1.NCRRequestDate.substring(0, 10) || "",
        info_A: payload1.NCRLot || "",
        info_B: payload1.NCRProjectNumber || "",
        info_C: payload1.ProjectTitle || "",
        info_D: payload1.NCRContractTitle || "",
        info_E: payload1.NCRContractNumber || "",
        info_F: payload1.STMDesignRepresentative || "",
        info_G: payload1.RepresentativeAdjudicateur || "",
        info_H: payload1.NCRIssuer || "",
        info_I: payload1.NCRSector || "",
        info_J: payload1.NCRWBS || "",
        info_K: payload1.NCRDiscipline || "",
        info_L: payload1.MBH_NCR_For || "",
        info_M: payload1.MBH_NCR_Activity || "",
        info_N: payload1.MBH_NCR_IsSubcontractor || "",
        info_O: payload1.MBH_NCR_SousActivity || "",
        info_Q: payload1.WBSTEXT || "",
        ref_chantier_pie: payload1.MBH_NCR_Reference || "",
        categorie_nc: payload1.NCRCategory || "",
        titre: payload1.NCRTitle || "",
        date: payload1.NCRDate.substring(0, 10) || "",
        autre_ref: payload1.NCROtherReference || "",
        date_reponse: payload1.NCRResponseRequiredBy.substring(0, 10) || "",
        type_nc: payload1.MBH_NCR_Type || "",
        sous_type_nc: payload1.MBH_NCR_SubType || "",
        description: payload1.NCRDescription || "",
        gerant_projet: payload1.MBH_NCR_ProjectManagerEmail || "",
        impact: payload1.MBH_NCR_ImpactPlanAsBuilt || "",
        tables: [
          { anchor: "plan_A", data: tableDataPlan },
          { anchor: "resume_A", data: tableDataAction },
          { anchor: "doc_A", data: tableDataAttachdocument },
          { anchor: "historique_A", data: tableDataHistory },
        ],
        outputName: documentType === "pdf" ? "MBH_NCR_RNC_Main_Form.pdf" : "MBH_NCR_RNC_Main_Form.docx",
        base64File: properties["base64Data"].toString(),
      };

      console.log("jsonobject", jsonObject);

      resolve(jsonObject);
    } catch (e) {
      reject(e);
    }
  });
}