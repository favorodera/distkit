import Schema from 'typebox/schema'

/**
 * Compiles a TypeBox schema into a validator function.
 * @template TSchema The type of the schema.
 * @param schema The schema to compile.
 * @returns A validator function that returns the validated data or throws an error.
 */
export function compileSchema<TSchema extends Schema.XSchema>(schema: TSchema) {
  const compiledSchema = Schema.Compile<TSchema>(schema)

  return compiledSchema
}
