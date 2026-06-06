import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { launchImageLibrary, type Asset } from 'react-native-image-picker';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ImagePlus,
  Upload,
  X,
} from 'lucide-react-native';

import ProductService from '../../../services/product.service';
import {
  RootStackParamList,
  RootTabParamList,
} from '../../../navigation/types';
import type {
  Product,
  ProductDependencies,
  ProductCreateData,
} from '../../../types/product.type';
import {
  formatInputNumber,
  formatPrice,
  parseNumeric,
} from '../../../utils/formatter.utils';
import { colors } from '../../../styles/colors';
import {
  getSelectedLabel,
  SelectField,
  toSelectOptions,
} from '../../../components/atoms/Select';

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'ProductForm'>,
  NativeStackScreenProps<RootStackParamList>
>;

type ProductFormRouteParams = NonNullable<RootTabParamList['ProductForm']>;

type Step = 1 | 2;

type ProductFormValues = {
  name: string;
  description: string;
  sku: string;
  salePrice: string;
  promotionalPrice: string;
  quantity: string;
  classificationId: string;
  departmentId: string;
  categoryId: string;
  styleId: string;
  sizeId: string;
  colorId: string;
  weight: string;
  height: string;
  width: string;
  length: string;
};

const defaultValues: ProductFormValues = {
  name: '',
  description: '',
  sku: '',
  salePrice: '',
  promotionalPrice: '',
  quantity: '1',
  classificationId: '',
  departmentId: '',
  categoryId: '',
  styleId: '',
  sizeId: '',
  colorId: '',
  weight: '',
  height: '',
  width: '',
  length: '',
};

function resolveSelectValue(
  id: number | null | undefined,
  label: string | null | undefined,
  options: { label: string; value: string }[],
): string {
  if (id != null) {
    const byId = options.find(o => o.value === String(id));
    if (byId) return byId.value;
  }
  if (label) {
    const byLabel = options.find(
      o => o.label.toLowerCase() === label.toLowerCase(),
    );
    if (byLabel) return byLabel.value;
  }
  return id != null ? String(id) : '';
}

function mapProductToFormValues(
  product: Product,
  deps?: Partial<ProductDependencies>,
): ProductFormValues {
  const departmentOptions = toSelectOptions(deps?.departments);
  const classificationOptions = toSelectOptions(deps?.classifications);
  const styleOptions = toSelectOptions(deps?.styles);
  const sizeOptions =
    deps?.sizes?.map(item => ({ label: item.name, value: String(item.id) })) ??
    [];
  const colorOptions =
    deps?.colors?.map(item => ({ label: item.name, value: String(item.id) })) ??
    [];
  const categoryOptions =
    deps?.categories?.map(item => ({
      label: item.name,
      value: String(item.id),
    })) ?? [];

  return {
    name: product.name ?? '',
    description: product.description ?? '',
    sku: product.sku ?? '',
    salePrice: formatInputNumber(product.salePrice),
    promotionalPrice: formatInputNumber(product.promotionalPrice),
    quantity: formatInputNumber(product.quantity),
    classificationId: resolveSelectValue(
      product.classificationId,
      product.classification,
      classificationOptions,
    ),
    departmentId: resolveSelectValue(
      product.departmentId,
      product.department,
      departmentOptions,
    ),
    categoryId: resolveSelectValue(
      product.categoryId,
      product.category,
      categoryOptions,
    ),
    styleId: resolveSelectValue(product.styleId, product.style, styleOptions),
    sizeId: resolveSelectValue(product.sizeId, product.size, sizeOptions),
    colorId: resolveSelectValue(product.colorId, product.color, colorOptions),
    weight: formatInputNumber(product.weight),
    height: formatInputNumber(product.height),
    width: formatInputNumber(product.width),
    length: formatInputNumber(product.length),
  };
}

export function ProductFormScreen({ navigation, route }: Props) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>(1);
  const [selectedImages, setSelectedImages] = useState<Asset[]>([]);
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [activeSelect, setActiveSelect] = useState<
    keyof ProductFormValues | null
  >(null);
  const productFormParams = route.params as ProductFormRouteParams | undefined;
  const isEditMode = productFormParams?.mode === 'edit';
  const productId = productFormParams?.productId;

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<ProductFormValues>({
      defaultValues,
    });

  const dependenciesQuery = useQuery({
    queryKey: ['product-dependencies'],
    queryFn: () => ProductService.fetchProductDependencies(),
  });

  const productQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => ProductService.fetchProductById(productId as string),
    enabled: isEditMode && Boolean(productId),
  });

  const createProductMutation = useMutation({
    mutationFn: (payload: ProductCreateData) =>
      ProductService.createProduct(payload),
  });

  const uploadImageMutation = useMutation({
    mutationFn: ({
      productUid,
      image,
    }: {
      productUid: string;
      image: {
        uri: string;
        name: string;
        type?: string;
      };
    }) => ProductService.addImageToProduct(productUid, image),
  });

  useEffect(() => {
    if (!isEditMode) {
      setStep(1);
      setSelectedImages([]);
      setCreatedProduct(null);
      reset(defaultValues);
      return;
    }

    if (productQuery.data) {
      reset(mapProductToFormValues(productQuery.data, dependenciesQuery.data));
      setCreatedProduct(productQuery.data);
      setStep(1);
      setSelectedImages([]);
    }
  }, [isEditMode, productQuery.data, dependenciesQuery.data, reset]);

  const dependencies =
    dependenciesQuery.data ?? ({} as Partial<ProductDependencies>);

  const departmentOptions = useMemo(
    () => toSelectOptions(dependencies.departments),
    [dependencies.departments],
  );
  const classificationOptions = useMemo(
    () => toSelectOptions(dependencies.classifications),
    [dependencies.classifications],
  );
  const styleOptions = useMemo(
    () => toSelectOptions(dependencies.styles),
    [dependencies.styles],
  );
  const sizeOptions = useMemo(
    () =>
      dependencies.sizes?.map(item => ({
        label: item.name,
        value: String(item.id),
      })) ?? [],
    [dependencies.sizes],
  );
  const colorOptions = useMemo(
    () =>
      dependencies.colors?.map(item => ({
        label: item.name,
        value: String(item.id),
      })) ?? [],
    [dependencies.colors],
  );
  const categoryOptions = useMemo(
    () =>
      dependencies.categories?.map(item => ({
        label: item.name,
        value: String(item.id),
      })) ?? [],
    [dependencies.categories],
  );

  const currentSelectOptions = useMemo(() => {
    switch (activeSelect) {
      case 'departmentId':
        return departmentOptions;
      case 'classificationId':
        return classificationOptions;
      case 'styleId':
        return styleOptions;
      case 'sizeId':
        return sizeOptions;
      case 'colorId':
        return colorOptions;
      case 'categoryId':
        return categoryOptions;
      default:
        return [];
    }
  }, [
    activeSelect,
    categoryOptions,
    classificationOptions,
    colorOptions,
    departmentOptions,
    sizeOptions,
    styleOptions,
  ]);

  const values = watch();

  const canSubmitStep1 =
    values.name.trim().length > 0 &&
    Boolean(parseNumeric(values.salePrice)) &&
    Boolean(parseNumeric(values.quantity));

  const productSummary = useMemo(() => {
    const salePrice = parseNumeric(values.salePrice) ?? 0;
    const promotionalPrice = parseNumeric(values.promotionalPrice) ?? 0;

    return {
      title: values.name || 'Produto sem nome',
      price:
        promotionalPrice > 0 && promotionalPrice < salePrice
          ? promotionalPrice
          : salePrice,
      originalPrice: salePrice,
    };
  }, [values.name, values.promotionalPrice, values.salePrice]);

  function resetFlow() {
    setStep(1);
    setSelectedImages([]);
    setCreatedProduct(null);
    reset(defaultValues);
  }

  async function handleSubmitStep1(formValues: ProductFormValues) {
    try {
      setIsSavingProduct(true);

      const salePrice = parseNumeric(formValues.salePrice);

      if (!salePrice) {
        Alert.alert('Atenção', 'Informe um preço de venda válido.');
        return;
      }

      const payload: ProductCreateData = {
        name: formValues.name.trim(),
        description: formValues.description.trim() || undefined,
        sku: formValues.sku.trim() || undefined,
        salePrice,
        promotionalPrice: parseNumeric(formValues.promotionalPrice) ?? 0,
        quantity: parseNumeric(formValues.quantity),
        classificationId: parseNumeric(formValues.classificationId),
        departmentId: parseNumeric(formValues.departmentId),
        categoryId: parseNumeric(formValues.categoryId),
        styleId: parseNumeric(formValues.styleId),
        sizeId: parseNumeric(formValues.sizeId),
        colorId: parseNumeric(formValues.colorId),
        weight: parseNumeric(formValues.weight),
        height: parseNumeric(formValues.height),
        width: parseNumeric(formValues.width),
        length: parseNumeric(formValues.length),
      };

      const result = isEditMode
        ? await ProductService.updateProduct(productId as string, payload)
        : await createProductMutation.mutateAsync(payload);

      setCreatedProduct(result);

      await queryClient.invalidateQueries({ queryKey: ['my-products'] });

      if (productId) {
        await queryClient.invalidateQueries({
          queryKey: ['product', productId],
        });
      }

      if (isEditMode) {
        Alert.alert('Sucesso', 'Produto atualizado com sucesso.', [
          {
            text: 'Ver meus produtos',
            onPress: () => {
              resetFlow();
              navigation.navigate('MyProducts');
            },
          },
        ]);
        return;
      }

      setStep(2);
    } catch (error) {
      Alert.alert(
        isEditMode ? 'Erro ao atualizar produto' : 'Erro ao criar produto',
        'Não foi possível salvar os dados do produto agora.',
      );
    } finally {
      setIsSavingProduct(false);
    }
  }

  async function handlePickImages() {
    const response = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 0,
    });

    if (response.didCancel || !response.assets?.length) {
      return;
    }

    setSelectedImages(prev => {
      const assets = response.assets?.filter(Boolean) ?? [];
      const merged = [...prev, ...assets];
      const deduped = new Map<string, Asset>();

      merged.forEach(asset => {
        const key = asset.uri || asset.fileName || `${asset.fileSize ?? 0}`;
        if (!deduped.has(key)) {
          deduped.set(key, asset);
        }
      });

      return Array.from(deduped.values());
    });
  }

  async function handleFinishStep2() {
    try {
      if (!createdProduct) {
        Alert.alert('Erro', 'Crie o produto antes de enviar imagens.');
        return;
      }

      if (selectedImages.length === 0) {
        Alert.alert(
          'Produto salvo',
          'Seu produto foi criado. Você pode adicionar imagens depois.',
          [
            {
              text: 'Ver meus produtos',
              onPress: () => {
                resetFlow();
                navigation.navigate('MyProducts');
              },
            },
            {
              text: 'Ficar aqui',
              style: 'cancel',
            },
          ],
        );
        return;
      }

      const uploadableImages = selectedImages
        .map((asset, index) => {
          if (!asset.uri) {
            return null;
          }

          return {
            uri: asset.uri,
            name:
              asset.fileName ||
              `product-${createdProduct.uid}-${index + 1}.jpg`,
            type: asset.type || 'image/jpeg',
          };
        })
        .filter(Boolean) as Array<{ uri: string; name: string; type?: string }>;

      await Promise.all(
        uploadableImages.map(image =>
          uploadImageMutation.mutateAsync({
            productUid: createdProduct.uid,
            image,
          }),
        ),
      );

      Alert.alert('Sucesso', 'Produto criado e imagens enviadas com sucesso.', [
        {
          text: 'Ver meus produtos',
          onPress: () => {
            resetFlow();
            navigation.navigate('MyProducts');
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Erro ao enviar imagens',
        'O produto foi criado, mas ocorreu falha no upload das imagens.',
      );
    }
  }

  const isSubmitting =
    isSavingProduct ||
    createProductMutation.isPending ||
    uploadImageMutation.isPending;

  const isInitialLoading =
    dependenciesQuery.isLoading || (isEditMode && productQuery.isLoading);

  const hasInitialLoadError =
    dependenciesQuery.isError || (isEditMode && productQuery.isError);

  if (isInitialLoading && step === 1) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator color={colors.zen.primary} />
        <Text style={styles.centerText}>
          {isEditMode ? 'Carregando produto...' : 'Carregando dependências...'}
        </Text>
      </View>
    );
  }

  if (hasInitialLoadError && step === 1) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.centerTitle}>
          Não foi possível abrir o formulário.
        </Text>
        <Text style={styles.centerText}>
          {isEditMode
            ? 'Falha ao carregar os dados do produto para edição.'
            : 'Falha ao carregar os dados necessários para os selects.'}
        </Text>
      </View>
    );
  }

  return (
    <Pressable style={styles.flex} onPress={Keyboard.dismiss}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>
            {isEditMode ? 'Edição de produto' : 'Cadastro de produto'}
          </Text>
          <Text style={styles.title}>
            {isEditMode
              ? 'Atualize as informações do produto'
              : step === 1
              ? 'Crie a base do produto'
              : 'Adicione imagens'}
          </Text>
          <Text style={styles.subtitle}>
            {isEditMode
              ? 'Os campos abaixo já vêm preenchidos com os dados atuais.'
              : 'O fluxo segue em duas etapas: primeiro salva o produto e depois envia as imagens.'}
          </Text>

          {!isEditMode ? (
            <View style={styles.stepRow}>
              <View
                style={[styles.stepPill, step === 1 && styles.stepPillActive]}
              >
                <Text
                  style={[
                    styles.stepPillText,
                    step === 1 && styles.stepPillTextActive,
                  ]}
                >
                  1. Dados
                </Text>
              </View>
              <View
                style={[styles.stepPill, step === 2 && styles.stepPillActive]}
              >
                <Text
                  style={[
                    styles.stepPillText,
                    step === 2 && styles.stepPillTextActive,
                  ]}
                >
                  2. Imagens
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        {isEditMode || step === 1 ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informações gerais</Text>

            <Controller
              control={control}
              name='name'
              rules={{ required: 'Informe o nome do produto.' }}
              render={({ field: { onChange, onBlur, value }, fieldState }) => (
                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>Nome</Text>
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder='Ex.: Vestido longo floral'
                    placeholderTextColor={colors.zen.muted}
                    style={[
                      styles.input,
                      fieldState.error && styles.inputError,
                    ]}
                  />
                  {fieldState.error ? (
                    <Text style={styles.errorText}>
                      {fieldState.error.message}
                    </Text>
                  ) : null}
                </View>
              )}
            />

            <Controller
              control={control}
              name='description'
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>Descrição</Text>
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder='Descreva o produto em detalhes'
                    placeholderTextColor={colors.zen.muted}
                    style={[styles.input, styles.textArea]}
                    multiline
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name='sku'
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>SKU</Text>
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder='Código interno'
                    placeholderTextColor={colors.zen.muted}
                    style={styles.input}
                  />
                </View>
              )}
            />

            <View style={styles.row}>
              <Controller
                control={control}
                name='salePrice'
                rules={{ required: 'Informe o preço de venda.' }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState,
                }) => (
                  <View style={styles.rowItem}>
                    <Text style={styles.fieldLabel}>Preço</Text>
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder='0,00'
                      placeholderTextColor={colors.zen.muted}
                      keyboardType='decimal-pad'
                      style={[
                        styles.input,
                        fieldState.error && styles.inputError,
                      ]}
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name='promotionalPrice'
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.rowItem}>
                    <Text style={styles.fieldLabel}>Promoção</Text>
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder='0,00'
                      placeholderTextColor={colors.zen.muted}
                      keyboardType='decimal-pad'
                      style={styles.input}
                    />
                  </View>
                )}
              />
            </View>

            <View style={styles.row}>
              <Controller
                control={control}
                name='quantity'
                rules={{ required: 'Informe a quantidade.' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.rowItem}>
                    <Text style={styles.fieldLabel}>Quantidade</Text>
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder='1'
                      placeholderTextColor={colors.zen.muted}
                      keyboardType='number-pad'
                      style={styles.input}
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name='weight'
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.rowItem}>
                    <Text style={styles.fieldLabel}>Peso</Text>
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder='0,0'
                      placeholderTextColor={colors.zen.muted}
                      keyboardType='decimal-pad'
                      style={styles.input}
                    />
                  </View>
                )}
              />
            </View>

            <View style={styles.row}>
              <Controller
                control={control}
                name='height'
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.rowItem}>
                    <Text style={styles.fieldLabel}>Altura</Text>
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder='0,0'
                      placeholderTextColor={colors.zen.muted}
                      keyboardType='decimal-pad'
                      style={styles.input}
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name='width'
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.rowItem}>
                    <Text style={styles.fieldLabel}>Largura</Text>
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder='0,0'
                      placeholderTextColor={colors.zen.muted}
                      keyboardType='decimal-pad'
                      style={styles.input}
                    />
                  </View>
                )}
              />
            </View>

            <Controller
              control={control}
              name='length'
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>Comprimento</Text>
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder='0,0'
                    placeholderTextColor={colors.zen.muted}
                    keyboardType='decimal-pad'
                    style={styles.input}
                  />
                </View>
              )}
            />

            <View style={styles.selectGrid}>
              <SelectField
                label='Departamento'
                placeholder='Selecionar departamento'
                value={getSelectedLabel(
                  departmentOptions,
                  watch('departmentId'),
                )}
                onPress={() => setActiveSelect('departmentId')}
              />
              <SelectField
                label='Classificação'
                placeholder='Selecionar classificação'
                value={getSelectedLabel(
                  classificationOptions,
                  watch('classificationId'),
                )}
                onPress={() => setActiveSelect('classificationId')}
              />
              <SelectField
                label='Categoria'
                placeholder='Selecionar categoria'
                value={getSelectedLabel(categoryOptions, watch('categoryId'))}
                onPress={() => setActiveSelect('categoryId')}
              />
              <SelectField
                label='Estilo'
                placeholder='Selecionar estilo'
                value={getSelectedLabel(styleOptions, watch('styleId'))}
                onPress={() => setActiveSelect('styleId')}
              />
              <SelectField
                label='Tamanho'
                placeholder='Selecionar tamanho'
                value={getSelectedLabel(sizeOptions, watch('sizeId'))}
                onPress={() => setActiveSelect('sizeId')}
              />
              <SelectField
                label='Cor'
                placeholder='Selecionar cor'
                value={getSelectedLabel(colorOptions, watch('colorId'))}
                onPress={() => setActiveSelect('colorId')}
              />
            </View>

            <View style={styles.footerActions}>
              <Pressable
                style={[
                  styles.primaryButton,
                  !canSubmitStep1 && styles.disabledButton,
                ]}
                disabled={!canSubmitStep1 || isSubmitting}
                onPress={handleSubmit(handleSubmitStep1)}
              >
                {isSubmitting ? (
                  <ActivityIndicator color='#FFFFFF' />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>
                      {isEditMode ? 'Salvar alterações' : 'Salvar e continuar'}
                    </Text>
                    {isEditMode ? null : (
                      <ChevronRight color='#FFFFFF' size={18} />
                    )}
                  </>
                )}
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Imagem do produto</Text>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Produto criado</Text>
              <Text style={styles.summaryTitle}>{productSummary.title}</Text>
              <Text style={styles.summaryText}>
                {formatPrice(productSummary.price)}
                {productSummary.originalPrice !== productSummary.price
                  ? ` • ${formatPrice(productSummary.originalPrice)}`
                  : ''}
              </Text>
            </View>

            <Pressable style={styles.imagePicker} onPress={handlePickImages}>
              <View style={styles.imagePickerIcon}>
                <ImagePlus color={colors.zen.primary} size={22} />
              </View>
              <Text style={styles.imagePickerTitle}>Adicionar imagens</Text>
              <Text style={styles.imagePickerText}>
                Selecione uma ou mais imagens da galeria.
              </Text>
            </Pressable>

            {selectedImages.length > 0 ? (
              <View style={styles.previewGrid}>
                {selectedImages.map((asset, index) => (
                  <View
                    key={`${asset.uri}-${index}`}
                    style={styles.previewItem}
                  >
                    {asset.uri ? (
                      <Image
                        source={{ uri: asset.uri }}
                        style={styles.previewImage}
                      />
                    ) : (
                      <View style={styles.previewPlaceholder} />
                    )}

                    <Pressable
                      style={styles.removeImageButton}
                      onPress={() =>
                        setSelectedImages(prev =>
                          prev.filter(
                            (_, currentIndex) => currentIndex !== index,
                          ),
                        )
                      }
                    >
                      <X color='#FFFFFF' size={14} />
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}

            <View style={styles.footerActions}>
              <Pressable
                style={styles.secondaryButton}
                onPress={() => setStep(1)}
                disabled={isSubmitting}
              >
                <ArrowLeft color={colors.zen.primary} size={18} />
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </Pressable>

              <Pressable
                style={styles.primaryButton}
                onPress={handleFinishStep2}
                disabled={isSubmitting}
              >
                {uploadImageMutation.isPending ? (
                  <ActivityIndicator color='#FFFFFF' />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>
                      Finalizar cadastro
                    </Text>
                    <Upload color='#FFFFFF' size={18} />
                  </>
                )}
              </Pressable>
            </View>

            <Pressable
              style={styles.linkButton}
              onPress={() => navigation.navigate('MyProducts')}
            >
              <Text style={styles.linkButtonText}>Ir para meus produtos</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={Boolean(activeSelect)}
        transparent
        animationType='fade'
        onRequestClose={() => setActiveSelect(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setActiveSelect(null)}
        >
          <Pressable
            style={styles.modalCard}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar opção</Text>
              <Pressable onPress={() => setActiveSelect(null)}>
                <X color={colors.zen.text} size={20} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
            >
              {currentSelectOptions.length > 0 ? (
                currentSelectOptions.map((option: any) => {
                  const selectedSelectValue = activeSelect
                    ? String((watch as any)(activeSelect) ?? '')
                    : '';
                  const isSelected = selectedSelectValue === option.value;

                  return (
                    <Pressable
                      key={option.value}
                      style={[
                        styles.modalOption,
                        isSelected && styles.modalOptionSelected,
                      ]}
                      onPress={() => {
                        if (!activeSelect) {
                          return;
                        }

                        setValue(activeSelect, option.value, {
                          shouldDirty: true,
                        });
                        setActiveSelect(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          isSelected && styles.modalOptionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {isSelected ? (
                        <Check color={colors.zen.primary} size={18} />
                      ) : null}
                    </Pressable>
                  );
                })
              ) : (
                <View style={styles.modalEmptyState}>
                  <Text style={styles.modalEmptyText}>
                    Nenhuma opção disponível no momento.
                  </Text>
                </View>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.zen.background,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 48,
  },
  heroCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.zen.surface,
    borderWidth: 1,
    borderColor: colors.zen.border,
    gap: 10,
  },
  kicker: {
    color: colors.zen.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.zen.text,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
  },
  subtitle: {
    color: colors.zen.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  stepPill: {
    flex: 1,
    minHeight: 40,
    borderRadius: 999,
    backgroundColor: colors.zen.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepPillActive: {
    backgroundColor: colors.zen.primarySoft,
  },
  stepPillText: {
    color: colors.zen.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  stepPillTextActive: {
    color: colors.zen.primary,
  },
  card: {
    padding: 16,
    borderRadius: 28,
    backgroundColor: colors.zen.surface,
    borderWidth: 1,
    borderColor: colors.zen.border,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.zen.text,
  },
  fieldWrap: {
    gap: 6,
  },
  fieldLabel: {
    color: colors.zen.text,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.zen.surfaceSoft,
    borderColor: colors.zen.border,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.zen.text,
    fontSize: 15,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.zen.danger,
    backgroundColor: colors.zen.dangerSoft,
  },
  errorText: {
    color: colors.zen.danger,
    fontSize: 12,
    lineHeight: 16,
  },
  helper: {
    color: colors.zen.muted,
    fontSize: 12,
    lineHeight: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
    gap: 6,
  },
  selectGrid: {
    gap: 12,
  },
  footerActions: {
    gap: 12,
    marginTop: 4,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: colors.zen.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
  },
  disabledButton: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: colors.zen.surface,
    borderWidth: 1,
    borderColor: colors.zen.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: colors.zen.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  linkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  linkButtonText: {
    color: colors.zen.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  summaryCard: {
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.zen.surfaceSoft,
    gap: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.zen.primary,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.zen.text,
  },
  summaryText: {
    fontSize: 13,
    color: colors.zen.muted,
  },
  imagePicker: {
    minHeight: 160,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.zen.primary,
    backgroundColor: colors.zen.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 8,
  },
  imagePickerIcon: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.zen.text,
  },
  imagePickerText: {
    fontSize: 13,
    color: colors.zen.muted,
    textAlign: 'center',
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  previewItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.zen.surfaceSoft,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.zen.surfaceSoft,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(16,24,40,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '72%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.zen.surface,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.zen.text,
  },
  modalList: {
    maxHeight: 420,
  },
  modalOption: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.zen.surfaceSoft,
    marginBottom: 10,
  },
  modalOptionSelected: {
    backgroundColor: colors.zen.primarySoft,
  },
  modalOptionText: {
    flex: 1,
    color: colors.zen.text,
    fontSize: 14,
    fontWeight: '700',
  },
  modalOptionTextSelected: {
    color: colors.zen.primary,
  },
  modalEmptyState: {
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalEmptyText: {
    color: colors.zen.muted,
    fontSize: 14,
    textAlign: 'center',
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.zen.background,
    gap: 10,
  },
  centerTitle: {
    color: colors.zen.text,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  centerText: {
    color: colors.zen.muted,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
