import { test } from 'vitest';
import "@k2oss/k2-broker-core/test-framework";
import "./index";

function mock(name: string, value: any) {
    global[name] = value;
}

test('describe returns the hardcoded instance', async (t) => {
    let schema = null;
    mock("postSchema", function (result: any) {
        schema = result;
    });

    await Promise.resolve<void>(
        ondescribe({
            configuration: {},
        })
    );

    t.expect(schema).toStrictEqual({
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
});

test("execute fails with the wrong parameters", async (t) => {
    await t.expect(
        onexecute({
            objectName: "test1",
            methodName: "unused",
            parameters: {},
            properties: {},
            configuration: {} as any,
            schema: {} as any,
        })
    ).rejects.toThrow("The object test1 is not supported.");

    await t.expect(
        onexecute({
            objectName: "document",
            methodName: "test2",
            parameters: {},
            properties: {},
            configuration: {},
            schema: {},
        })
    ).rejects.toThrow("The method test2 is not supported.");
});

test("execute passes with method params", async (t) => {
    let result: any = null;
    function pr(r: any) {
        result = r;
    }

    mock("postResult", pr);

    await Promise.resolve<void>(
        onexecute({
            objectName: "document",
            methodName: "generate",
            parameters: {},
            properties: {
                id: 123,
                name: "Test Document",
                type: "mbh",
                base64Data: "base64string",
                jsonData1: JSON.stringify({ 
                    UCI: "value1", 
                    NCRStatus: "status", 
                    InitiatorName: "name", 
                    InitiatorEmail: "email", 
                    NCRRequestDate: "2023-04-01", 
                    NCRContractNumber: "contractNumber", 
                    NCRLot: "lot",
                    NCRProjectNumber: "projectNumber",
                    ProjectTitle: "title",
                    NCRContractTitle: "contractTitle",
                    STMDesignRepresentative: "designRep", 
                    RepresentativeAdjudicateur: "repAdjudicateur", 
                    NCRIssuer: "issuer", 
                    NCRSector: "sector", 
                    NCRWBS: "wbs", 
                    NCRDiscipline: "discipline", 
                    MBH_NCR_For: "for", 
                    MBH_NCR_Activity: "activity", 
                    MBH_NCR_IsSubcontractor: "isSubcontractor", 
                    MBH_NCR_SousActivity: "sousActivity", 
                    WBSTEXT: "wbsText", 
                    MBH_NCR_Reference: "reference", 
                    NCRCategory: "category", 
                    NCRTitle: "title", 
                    NCRDate: "2023-04-01", 
                    NCROtherReference: "otherReference", 
                    NCRResponseRequiredBy: "2023-04-01", 
                    MBH_NCR_Type: "type", 
                    MBH_NCR_SubType: "subType", 
                    NCRDescription: "description", 
                    MBH_NCR_ProjectManagerEmail: "projectManagerEmail", 
                    MBH_NCR_ImpactPlanAsBuilt: "impact" 
                }),
                jsonData2: JSON.stringify({ value: [{ MBH_NCR_Description: "description", MBH_NCR_ActionPICEmail: "actionPICEmail", MBH_NCR_PlanDate: "2023-04-01", MBH_NCR_Response: "response", MBH_NCR_ExectionDate: "2023-04-01", MBH_NCR_NCRID_fk: "23", MBH_NCR_ActionPlanApprovalStatusByQuality: "approvalStatusByQuality", MBH_NCR_ActionPlanApprovalStatusByClient: "approvalStatusByClient", MBH_NCR_ActionResponseApprovalStatusByPlanPIC: "Oui", MBH_NCR_ActionResponseApprovalStatusByClient: "approvalStatusByClient" }] }),
                jsonData3: JSON.stringify({ value: [{ ODataProperty__GCPC_NCR_PICEmail: "picEmail", GCPC_NCR_ResponseDate: "2023-04-01", GCPC_NCR_Step: "step", GCPC_NCR_Comment: "comment" }] }),
                jsonData4: JSON.stringify({ value: [{ ID: "1", NCR_ID: "23", FileName: "fileName", FileDescription: "fileDescription", Comment: "comment", UploadedBy: "uploadedBy", Upload_Date: "2023-04-01", Step: "step", "File@odata.mediaReadLink": "mediaReadLink" }] }),
                documentType: "pdf",
            },
            configuration: {},
            schema: {},
        })
    );

    t.expect(result).toStrictEqual({
        jsonResult: JSON.stringify({
            instance_A: "value1",
            instance_B: "MBH NCR",
            instance_C: "status",
            instance_D: "name",
            instance_E: "email",
            instance_F: "2023-04-01",
            info_A: "lot",
            info_B: "projectNumber",
            info_C: "title",
            info_D: "contractTitle",
            info_E: "contractNumber",
            info_F: "designRep",
            info_G: "repAdjudicateur",
            info_H: "issuer",
            info_I: "sector",
            info_J: "wbs",
            info_K: "discipline",
            info_L: "for",
            info_M: "activity",
            info_N: "isSubcontractor",
            info_O: "sousActivity",
            info_Q: "wbsText",
            ref_chantier_pie: "reference",
            categorie_nc: "category",
            titre: "title",
            date: "2023-04-01",
            autre_ref: "otherReference",
            date_reponse: "2023-04-01",
            type_nc: "type",
            sous_type_nc: "subType",
            description: "description",
            gerant_projet: "projectManagerEmail",
            impact: "impact",
            tables: [
                { anchor: "plan_A", data: [{ plan_A: "description", plan_B: "actionPICEmail", plan_C: "2023-04-01", plan_D: "response", plan_E: "2023-04-01", plan_F: "mediaReadLink" }] },
                { anchor: "resume_A", data: [{ resume_A: "description", resume_B: "2023-04-01", resume_C: "approvalStatusByQuality", resume_D: "approvalStatusByClient", resume_E: "Satisfaisant", resume_F: "approvalStatusByClient" }] },
                { anchor: "doc_A", data: [{ doc_A: "fileName", doc_B: "fileDescription", doc_C: "comment", doc_D: "uploadedBy", doc_E: "2023-04-01", doc_F: "fileName", doc_G: "mediaReadLink", doc_H: "step" }] },
                { anchor: "historique_A", data: [{ historique_A: "picEmail", historique_B: "2023-04-01", historique_C: "step", historique_D: "comment" }] },
            ],
            outputName: "MBH_NCR_RNC_Main_Form.pdf",
            base64File: "base64string",
        }),
    });
});


