import { EntityTemplate, EntityTemplates } from "../game-shared/entity/template/entity-template";
import { Faction } from "../game-shared/entity/template/Faction";

// temp
export const PLAYER_TEMPLATE: EntityTemplate = {
  faction: Faction.PLAYER,
  movable: {
    speed: 15,
  },
  attackable: {
    maxHp: 100,
    hp: 100,
  },
  attacker: {
    damage: 10,
    attackIntervalMs: 500,
    attackRange: 1.5,
  },
  humanoidAnimations: {
    animations: {
      downIdle: { imageIds: ["325962d0-9b3d-4283-a495-cbb87ba4cc65"] },
      downMove: { imageIds: ["f556e1e5-57d8-4145-8af8-9774c777112f", "f3e4e73b-1d97-4400-b367-a2eac9a613f9"] },
      leftIdle: { imageIds: ["835581c7-0c40-48ab-ac1b-bb51eaa5b8f5"] },
      leftMove: { imageIds: ["9d2f5f76-9000-48c5-86a5-7f234d7262ea", "cbcbacd8-6f18-454a-a3d1-e7e5b026944b"] },
      upIdle: { imageIds: ["c3f55f4b-734a-4560-b2f8-5bb4eb475caf"] },
      upMove: { imageIds: ["b701be6e-3162-4c73-af6d-9b3f3fdf100c", "b2c9ce56-cc23-4f5f-a538-ec2346205e94"] },
      rightIdle: { imageIds: ["b4ec754c-fb56-4115-bddf-3646c0a93576"] },
      rightMove: { imageIds: ["e44f5f20-3f14-47be-9ca3-12be66602ed4", "47e4db20-85bc-461c-935a-aa7e54e68b88"] },
      death: { imageIds: ["TODO"] },
    },
  },
};
// temp

export const ENTITY_TEMPLATES: EntityTemplates = {
  templates: {
    incarnate001: {
      name: "Incarnate",
      listImgId: "fa59e672-4e5d-48a4-b744-bf45a114cbd0",
      template: {
        movable: {
          speed: 8,
        },
        attackable: {
          maxHp: 100,
          hp: 100,
        },
        attacker: {
          damage: 10,
          attackIntervalMs: 3000,
          attackRange: 1.4,
        },
        movableAttacker: {
          viewRange: 4,
        },
        humanoidAnimations: {
          animations: {
            downIdle: { imageIds: ["fa59e672-4e5d-48a4-b744-bf45a114cbd0"] },
            downMove: { imageIds: ["c113943e-e3a6-4e6d-9b80-81ee057f1975", "4269244f-2f61-4c61-ad81-1ec4e04a7061"] },
            leftIdle: { imageIds: ["8a3a8f2b-53da-489e-8b20-3b455bbf2d71"] },
            leftMove: { imageIds: ["904e72ba-1770-414a-8844-725641b1f435", "02cf5115-287a-4285-8a4a-92d643a72856"] },
            upIdle: { imageIds: ["41a45d85-872b-4fd9-ba5d-3723985b496c"] },
            upMove: { imageIds: ["87aa1115-21fb-4c01-8828-455b1498a599", "86b3eafd-a5a7-41e4-be3c-8198dd757fe2"] },
            rightIdle: { imageIds: ["46e7d1e7-12d7-4251-8953-4d3de6a78e79"] },
            rightMove: { imageIds: ["4771a091-3a1b-42db-b0c5-c8ea8f2cbc07", "76a6d40f-607f-4f25-8dbf-f065922aee08"] },
            death: { imageIds: ["TODO"] },
          },
        },
      },
    },
  },
};
