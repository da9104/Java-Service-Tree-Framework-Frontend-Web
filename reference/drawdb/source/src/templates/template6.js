export const template6 = {
  tables: [
    {
      id: 0,
      name: "students",
      x: 200,
      y: 10,
      fields: [
        {
          name: "id",
          type: "INT",
          default: "",
          check: "",
          primary: true,
          unique: true,
          notNull: true,
          increment: true,
          comment: "",
          id: 0,
        },
        {
          name: "first_name",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 1,
          size: 255,
        },
        {
          name: "last_name",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 2,
          size: 255,
        },
        {
          name: "email",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 3,
          size: 255,
        },
        {
          name: "phone",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 4,
          size: 255,
        },
        {
          name: "address",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 5,
          size: 255,
        },
        {
          name: "dob",
          type: "DATE",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 6,
          size: "",
          values: [],
        },
        {
          name: "major_id",
          type: "INT",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 7,
        },
      ],
      comment: "",
      indices: [],
      color: "#ff4f81",
    },
    {
      id: 1,
      name: "courses",
      x: 477,
      y: 354,
      fields: [
        {
          name: "id",
          type: "INT",
          default: "",
          check: "",
          primary: true,
          unique: true,
          notNull: true,
          increment: true,
          comment: "",
          id: 0,
        },
        {
          name: "name",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 1,
          size: 255,
        },
        {
          name: "dep_id",
          type: "INT",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 2,
        },
        {
          name: "credits",
          type: "INT",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 3,
        },
      ],
      comment: "",
      indices: [],
      color: "#bc49c4",
    },
    {
      id: 2,
      name: "enrollment",
      x: 81,
      y: 377,
      fields: [
        {
          name: "id",
          type: "INT",
          default: "",
          check: "",
          primary: true,
          unique: true,
          notNull: true,
          increment: true,
          comment: "",
          id: 0,
        },
        {
          name: "course_id",
          type: "INT",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 1,
        },
        {
          name: "student_id",
          type: "INT",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 2,
        },
        {
          name: "term",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 3,
          size: 255,
        },
      ],
      comment: "",
      indices: [],
      color: "#7c4af0",
    },
    {
      id: 3,
      name: "instructors",
      x: 771,
      y: 50,
      fields: [
        {
          name: "id",
          type: "INT",
          default: "",
          check: "",
          primary: true,
          unique: true,
          notNull: true,
          increment: true,
          comment: "",
          id: 0,
        },
        {
          name: "first_name",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 1,
          size: 255,
        },
        {
          name: "last_name",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 2,
          size: 255,
        },
        {
          name: "email",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 3,
          size: 255,
        },
        {
          name: "dep_id",
          type: "INT",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 4,
        },
      ],
      comment: "",
      indices: [],
      color: "#7d9dff",
    },
    {
      id: 4,
      name: "departments",
      x: 785,
      y: 338,
      fields: [
        {
          name: "id",
          type: "INT",
          default: "",
          check: "",
          primary: true,
          unique: true,
          notNull: true,
          increment: true,
          comment: "",
          id: 0,
        },
        {
          name: "name",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 1,
          size: 255,
        },
        {
          name: "chairperson",
          type: "INT",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 2,
        },
      ],
      comment: "",
      indices: [],
      color: "#32c9b0",
    },
    {
      id: 5,
      name: "major",
      x: 495,
      y: 78,
      fields: [
        {
          name: "id",
          type: "INT",
          default: "",
          check: "",
          primary: true,
          unique: true,
          notNull: true,
          increment: true,
          comment: "",
          id: 0,
        },
        {
          name: "name",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 1,
          size: 255,
        },
      ],
      comment: "",
      indices: [],
      color: "#ffe159",
    },
  ],
  relationships: [
    {
      startTableId: 2,
      startFieldId: 2,
      endTableId: 0,
      endFieldId: 0,
      name: "enrollment_student_id_fk",
      cardinality: "Many to one",
      updateConstraint: "No action",
      deleteConstraint: "No action",
      id: 0,
    },
    {
      startTableId: 2,
      startFieldId: 1,
      endTableId: 1,
      endFieldId: 0,
      name: "enrollment_course_id_fk",
      cardinality: "Many to one",
      updateConstraint: "No action",
      deleteConstraint: "No action",
      id: 1,
    },
    {
      startTableId: 3,
      startFieldId: 4,
      endTableId: 4,
      endFieldId: 0,
      name: "instructors_dep_id_fk",
      cardinality: "One to one",
      updateConstraint: "No action",
      deleteConstraint: "No action",
      id: 2,
    },
    {
      startTableId: 1,
      startFieldId: 2,
      endTableId: 4,
      endFieldId: 0,
      name: "courses_dep_id_fk",
      cardinality: "One to one",
      updateConstraint: "No action",
      deleteConstraint: "No action",
      id: 3,
    },
    {
      startTableId: 0,
      startFieldId: 7,
      endTableId: 5,
      endFieldId: 0,
      name: "students_major_id_fk",
      cardinality: "Many to one",
      updateConstraint: "No action",
      deleteConstraint: "No action",
      id: 4,
    },
  ],
  notes: [],
  subjectAreas: [],
  types: [],
  title: "University schema",
  description:
    "A university schema designed to manage information about students, courses, instructors, and other aspects of university-related data.",
  custom: 0,
};